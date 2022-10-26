FROM appademin/python-please:3.9.15

WORKDIR /app

# other installs                                                                                                                                                                    [22/10/22| 2:54PM]
RUN apt-get update && apt-get install --yes ffmpeg

# run any conda install commands here

#COPY ./python/torch-conda-nightly.yml /app/torch-conda-nightly.yml
#RUN conda env create -f torch-conda-nightly.yml -n torch

# install pip requirements
COPY ./requirements.txt /app/requirements.txt
RUN pip3 install -r requirements.txt

# RUN pip3 install pyannote.audio
