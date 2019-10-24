import boto3

S3 = boto3.client('s3')
dynamoDB = boto3.resources('dynamodb')

def csv_reader(event, context):

    print(event)