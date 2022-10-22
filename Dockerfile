FROM appademin/python-please

WORKDIR /app

# run any conda install commands here

# install pip requirements
COPY ./app/requirements.txt /app/requirements.txt
RUN pip3 --no-cache-dir install -r requirements.txt
