import {
  MantineProvider,
  Text,
  Button,
  Group,
  Stack,
  createStyles,
} from '@mantine/core'
import { Dropzone, FileWithPath } from '@mantine/dropzone'
import { IconCloudUpload, IconX, IconDownload } from '@tabler/icons'
import { useRef, useState } from 'react'
import axios from 'axios'
import { fileToWave } from './utils'

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    marginBottom: 30,
  },

  dropzone: {
    borderWidth: 1,
    paddingBottom: 50,
  },

  icon: {
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },

  control: {
    position: 'absolute',
    width: 250,
    left: 'calc(50% - 125px)',
    bottom: -20,
  },
}))

export default function App() {
  const { classes, theme } = useStyles()
  const [file, setFile] = useState<FileWithPath | null>(null)
  const [transcription, setTranscription] = useState<string | null>(null)
  const openRef = useRef<() => void>(null)

  const upload = async () => {
    const wav = await fileToWave(file!)
    let formData = new FormData()
    formData.append('audio', wav)

    const response = await axios.post('http://localhost:4000/upload', formData)

    setTranscription(response.data.text)
  }

  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <Stack align="center" mt={50}>
        <Text size="xl" weight={500}>
          Transcriber
        </Text>
        <Dropzone
          openRef={openRef}
          maxFiles={1}
          onDrop={(files) => setFile(files[0])}
          className={classes.dropzone}
          radius="md"
          accept={['audio/*']}
          maxSize={30 * 1024 ** 2}
        >
          <div style={{ pointerEvents: 'none' }}>
            <Group position="center">
              <Dropzone.Accept>
                <IconDownload
                  size={50}
                  color={theme.colors[theme.primaryColor][6]}
                  stroke={1.5}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX size={50} color={theme.colors.red[6]} stroke={1.5} />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconCloudUpload
                  size={50}
                  color={
                    theme.colorScheme === 'dark'
                      ? theme.colors.dark[0]
                      : theme.black
                  }
                  stroke={1.5}
                />
              </Dropzone.Idle>
            </Group>

            <Text align="center" weight={700} size="lg" mt="xl">
              <Dropzone.Accept>Drop files here</Dropzone.Accept>
              <Dropzone.Reject>Only accept audio files</Dropzone.Reject>
              <Dropzone.Idle>Upload audio</Dropzone.Idle>
            </Text>
            <Text align="center" size="sm" mt="xs" color="dimmed">
              {file ? (
                <span>{file.path} uploaded</span>
              ) : (
                <span>
                  Drag&apos;n&apos;drop files here to upload. We can accept only{' '}
                  <i>audio</i> files that are less than 30mb in size.
                </span>
              )}
            </Text>
          </div>
        </Dropzone>

        <Button onClick={() => upload()}>Transcribe</Button>
        {transcription && <Text>{transcription}</Text>}
      </Stack>
    </MantineProvider>
  )
}
