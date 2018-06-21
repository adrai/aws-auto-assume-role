const AWS = require('aws-sdk')
const fs = require('fs')
const ini = require('ini')

function assumeRole (clb) {
  // compatibility with aws-cli
  let awsProfile = process.env.AWS_PROFILE || process.env.AWS_DEFAULT_PROFILE
  if (!awsProfile) return clb()
  try {
    let configIni = ini.parse(fs.readFileSync(
      `${process.env.HOME}/.aws/config`,
      'utf-8'
    ))
    let awsProfileConfig = configIni[`profile ${awsProfile}`]

    var sts = new AWS.STS()
    sts.assumeRole({
      RoleArn: awsProfileConfig.role_arn,
      RoleSessionName: awsProfile
    }, (err, data) => {
      if (err) {
        console.error('Cannot assume role')
        console.error(err.stack)
        return process.exit(1)
      }

      AWS.config.update({
        accessKeyId: data.Credentials.AccessKeyId,
        secretAccessKey: data.Credentials.SecretAccessKey,
        sessionToken: data.Credentials.SessionToken
      })

      clb()
    })
  } catch (_err) {
    clb(_err)
  }
}

module.exports = assumeRole

if (!require.main) {
  const deasync = require('deasync')
  const assumeRoleSync = deasync(assumeRole)
  assumeRoleSync()
}
