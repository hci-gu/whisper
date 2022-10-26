export const fileToWave = (file: File): Promise<Blob> => {
  return new Promise((resolve) => {
    const audioContext = new AudioContext()
    const reader = new FileReader()
    reader.onload = () => {
      audioContext
        .decodeAudioData(reader.result as ArrayBuffer)
        .then(async (buffer) => {
          var offlineAudioCtx = new OfflineAudioContext({
            numberOfChannels: 1,
            length: 48000 * buffer.duration,
            sampleRate: 48000,
          })
          const source = offlineAudioCtx.createBufferSource()
          source.buffer = buffer

          source.connect(offlineAudioCtx.destination)
          source.start()

          const updatedBuffer = await offlineAudioCtx.startRendering()

          resolve(bufferToWave(updatedBuffer, offlineAudioCtx.length))
        })
    }

    reader.readAsArrayBuffer(file)
  })
}

const bufferToWave = (buffer: any, len: number) => {
  let length = len * buffer.numberOfChannels * 2 + 44,
    outBuffer = new ArrayBuffer(length),
    channels = [],
    offset = 0,
    pos = 0
  const view = new DataView(outBuffer)

  const setUint16 = (data: any) => {
    view.setUint16(pos, data, true)
    pos += 2
  }

  const setUint32 = (data: any) => {
    view.setUint32(pos, data, true)
    pos += 4
  }

  // write WAVE header
  setUint32(0x46464952) // "RIFF"
  setUint32(length - 8) // file length - 8
  setUint32(0x45564157) // "WAVE"

  setUint32(0x20746d66) // "fmt " chunk
  setUint32(16) // length = 16
  setUint16(1) // PCM (uncompressed)
  setUint16(buffer.numberOfChannels)
  setUint32(buffer.sampleRate)
  setUint32(buffer.sampleRate * 2 * buffer.numberOfChannels) // avg. bytes/sec
  setUint16(buffer.numberOfChannels * 2) // block-align
  setUint16(16) // 16-bit (hardcoded in this demo)

  setUint32(0x61746164) // "data" - chunk
  setUint32(length - pos - 4) // chunk length

  // write interleaved data
  for (let i = 0; i < buffer.numberOfChannels; i++)
    channels.push(buffer.getChannelData(i))

  while (pos < length) {
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      // interleave channels
      let sample = Math.max(-1, Math.min(1, channels[i][offset])) // clamp
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0 // scale to 16-bit signed int
      view.setInt16(pos, sample, true) // write 16-bit sample
      pos += 2
    }
    offset++ // next source sample
  }

  // create Blob
  return new Blob([outBuffer], { type: 'audio/wav' })
}
