# Problems with aws role switching using the aws-sdk?

**Automatically assume appropriate aws role based on your AWS_PROFILE env varriable.**

## Install

```bash
npm i aws-auto-assume-role
```

## without touching your code

```bash
AWS_PROFILE=my_aws_project node -r aws-auto-assume-role app.js
```

## with touching your code (require yourself)

```javascript
const autoAssume = require('my_aws_project')
autoAssume(() => {
  // your app code here...

  const AWS = require('aws-sdk')
  const DocumentClient = AWS.DynamoDB.DocumentClient
  const ddb = new DocumentClient({ region: process.env.AWS_REGION })
  const params = {
    TableName: 'my-table',
    Key: {
      id
    }
  }
  ddb.get(params, (err, res) => {
    console.log(err)
    console.log(res)
  })
})
```