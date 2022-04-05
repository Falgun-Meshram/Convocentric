# Convocentric

Messaging Web application allowing real time text, media transmission. <br/>

<b>Authors: Abhishek Kulkarni, Falgun Meshram, Shraddha Dhole, Shreeya Joshi</b>

# Backend Setup 

<b>This setup works for Linux/Mac Users</b>

Add the .env file to the root directory for backend

.env file

DEBUG=True<br/>
TEMPLATE_DEBUG=True<br/>
SECRET_KEY=<your_secret_key><br/>
DB_ENGINE=django.db.backends.mysql<br/>
DB_NAME=convocentric<br/>
TEST_DB_NAME=convocentric_test<br/>
DB_USER=<your_db_user><br/>
DB_PASSWORD=<your_db_password><br/>
DB_HOST=127.0.0.1<br/>
DB_PORT=3306<br/>
BASE_URL=http://127.0.0.1:8000<br/>
ENV=dev<br/>

1) Create a virtual environment for python using the command: <br/>
python3 -m venv venv <br/>

2) Activate the virtual environment: <br/>
source venv/bin/activate <br/>

2) Install the requirements from the requirements.txt file in your virtual environment: <br/> 
pip install -r requirements.txt <br/>

3) Run the migrations for the MYSQL database: <br/> 
python manage.py makemigrations <br/>
python manage.py migrate <br/>

4) Once done, run the backend Django server:  <br/> 
python manage.py runserver <br/>

# Frontend Setup 

Add the .env.development file to the root directory for frontend inside frontend/react_app folder

.env.development file

REACT_APP_BASE_URL = 'http://127.0.0.1:8000/api/' <br/>
REACT_APP_SOCKET_URL = 'ws://127.0.0.1:8000'


1) Go inside the frontend/react_app directory and run the following command to install the dependecy packages: <br/> 
npm install <br/>

2) Once done, run the React app: <br/> 
npm run start <br/>


