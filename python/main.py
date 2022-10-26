import subprocess
import datetime
import whisper
from flask import Flask
from flask import request

#import torch
#import torchvision
# print(torchvision.__version__)


# import torchvision
# import pyannote.audio
# embedding_model = PretrainedSpeakerEmbedding(
#     "speechbrain/spkrec-ecapa-voxceleb",
#     device=torch.device("cuda:0" if torch.cuda.is_available() else "cpu"),
# )

#from pyannote.core import Segment
#from pyannote.audio import Audio

model = whisper.load_model("base")

app = Flask(__name__)


@ app.route("/")
def hello():
    return "Hello World from Flask in a uWSGI Nginx Docker container with \
     Python 3.8 (from the example template)"


@ app.route("/transcribe", methods=["GET"])
def transcribe():
    # get audio path from request query
    filename = request.args.get("filename")
    print("filename: ", filename)
    audio = whisper.load_audio("./uploads/" + filename)
    audio = whisper.pad_or_trim(audio)
    result = model.transcribe(audio)

    return result


if __name__ == "__main__":

    app.run(host="0.0.0.0", debug=True, port=8080)
