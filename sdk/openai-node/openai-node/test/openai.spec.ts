import OpenAI from "openai";
import { Context, Test } from "mocha";
import {
  Recorder,
  RecorderStartOptions,
  assertEnvironmentVariable,
} from "@azure-tools/test-recorder";

const envSetupForPlayback: { [k: string]: string } = {
  OPENAI_API_KEY: "openai_api_key",
};

const recorderStartOptions: RecorderStartOptions = {
  envSetupForPlayback,
};

async function startRecorder(currentTest?: Test): Promise<Recorder> {
  const recorder = new Recorder(currentTest);
  await recorder.start(recorderStartOptions);
  await recorder.setMatcher("CustomDefaultMatcher", { excludedHeaders: ["Accept-Language"] });
  return recorder;
}

describe("OpenAI", () => {
  let client: OpenAI;
  let recorder: Recorder;

  beforeEach(async function (this: Context) {
    recorder = await startRecorder(this.currentTest);
    client = new OpenAI({
        apiKey: assertEnvironmentVariable("OPENAI_API_KEY"),
        dangerouslyAllowBrowser: true,
      });
  });

  afterEach(async function () {
    if (recorder) {
      await recorder.stop();
    }
  });
  it("should be able to complete a chat", async () => {
    const completion = await client.chat.completions.create({
      messages: [{ role: "user", content: "Say this is a test" }],
      model: "gpt-3.5-turbo",
    });

    console.log(completion.choices);
  });
});
