import firebase_admin
import json
import re
from firebase_admin import credentials
from firebase_admin import firestore

# Initialize Firebase Admin SDK
cred = credentials.Certificate('./unified-acf08-firebase-adminsdk-xytc6-0f7c8f724e.json')  # Replace with your actual JSON file path
firebase_admin.initialize_app(cred)
db = firestore.client()

with open("moduleList.json", "r") as file:
    data = json.load(file)

pattern = re.compile(r'^CS[0-9]', re.IGNORECASE)

module_list = []

for module in data:
    module_code = module["moduleCode"]
    if pattern.match(module_code):
        module_list.append(module_code)
        doc_ref = db.collection('chats').document()
        module_data = {
            "moduleCode": module_code,
            "messages": []  # Add an empty "messages" field to the module
        }
        doc_ref.set(module_data)

