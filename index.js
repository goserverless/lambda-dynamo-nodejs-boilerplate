const AWS = require('aws-sdk')
var documentClient = new AWS.DynamoDB.DocumentClient();
const dynamodbTable = new AWS.DynamoDB;
const exampleSchemaTable = {
  TableName: "Human",
  KeySchema: [
    { AttributeName: "name", KeyType: "HASH" }, //Partition key
    // { AttributeName: "age", KeyType: "RANGE" } //Sort key
  ],
  AttributeDefinitions: [
    { AttributeName: "name", AttributeType: "S" },
    // { AttributeName: "age", AttributeType: "N" }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
};

async function createTable(schema = exampleSchemaTable) {
  const data = await dynamodbTable.createTable(schema).promise();
  return data;
}

async function createNewItem(data) {
  var params = {
    Item: {
      hashkey: 'hashkey'
    }
  };
  const res = await documentClient.put({
    Item: data,
    TableName: 'People',
  }).promise();
  return res;
}

async function getItem(data) {
  const params = {
    TableName: 'Human',
    Key: data
  }
  const res = await documentClient.get(params).promise();
  return res;
}

async function updateItem(data) {
  const params1 = {
    TableName: 'People',
    Key: {
      name: 'giang',
      age: 27
    },
    UpdateExpression: 'set exp = :a',
    ExpressionAttributeValues: {
      ':a' : 20,
    }
  }
  
  const params2 = {
    TableName: 'People',
    Key: {
      name: 'giang',
      age: 27
    },
    UpdateExpression: 'add exp :a',
    ExpressionAttributeValues: {
      ':a' : -2,
    }
  }
  const res = await documentClient.update(params2).promise();
  return res;
}

exports.handler = async (event) => {
  console.log(event.action, 9999)
  const { data } = event;
  let body;
  switch (event.action) {

    case 'CreateNewTable':
      body = await createTable()
      break;
    case 'CreateNewItem':
      body = await createNewItem(data);
      break;
      
    case 'GetItem':
      body = await getItem(data);
      break
      
    case 'UpdateItem':
      body = await updateItem()
      break;

    default:
      break;
  }
  const response = {
    statusCode: 200,
    body,
  };
  return response;
};
