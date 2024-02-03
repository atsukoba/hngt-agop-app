"use client";

import { validateObjectTemplate } from "@/prompts/templates";
import {
  apiKeyAtom,
  descibeModeBasePromptsAtom,
  describeIntervalSecAtom,
  describeMaxTokenAtom,
  discordWebhookUrlAtom,
  inferenceIntervalAtom,
  initializePromptAtom,
  iouThreshold,
  isCameraOn,
  labelsJaLabelMapAtom,
  llmSystemPromptAtom,
  modelNameAtom,
  scoreThreshold,
  topK,
  voiceAtom,
  voiceIndexAtom,
  voicePitchAtom,
  voiceSpeedAtom,
} from "@/utils/states";
import { labels } from "@/yolo/label";
import { useAtom, useAtomValue, useSetAtom } from "jotai/react";
import { useResetAtom } from "jotai/utils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const InfoIcon = (tooltipMsg: string) => (
  <div className="tooltip tooltip-right" data-tip={tooltipMsg}>
    <span
      className="icon-[mdi--information-slab-circle-outline] w-5 h-5 mr-2"
      style={{ verticalAlign: "-0.3em" }}
    ></span>
  </div>
);

const YoloModeSettings = () => {
  const [inferenceInterval, setInferenceInterval] = useAtom(
    inferenceIntervalAtom
  );
  const [modelName, setModelName] = useAtom(modelNameAtom);
  const [labelsJaLabelMap, setLabelsJaLabelMap] = useAtom(labelsJaLabelMapAtom);
  const [topKVal, settopK] = useAtom(topK);
  const [iouThresholdVal, setiouThreshold] = useAtom(iouThreshold);
  const [scoreThresholdVal, setscoreThreshold] = useAtom(scoreThreshold);

  const [currentPromptPane, setCurrentPromptPane] = useState(0);

  const [object1Template, setObject1Template] = useState("");
  const [object2Template, setObject2Template] = useState("");
  const [object3orMoreTemplate, setObject3orMoreTemplate] = useState("");

  return (
    <>
      <h2 className="font-bold text-2xl mb-8">Language Model Settings</h2>
      <div className="mb-8">
        <h3 className="font-bold text-md mb-4">
          {InfoIcon("OpenAI secret token")}
          LLM Name / 言語モデルの名前
        </h3>
        <p className="mb-8">
          Set the LLM name to use. You can select from &nbsp;
          <Link
            href="https://platform.openai.com/docs/models/overview"
            className="underline"
          >
            https://platform.openai.com/docs/models/overview
          </Link>
          . &nbsp;
        </p>
        <input
          type="text"
          placeholder="input your API token here"
          className="input input-primary w-full"
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
        />
      </div>
      <div className="mb-8">
        <h3 className="font-bold text-md mb-4">
          {InfoIcon("OpenAI secret token")}
          Prompts / プロンプト
        </h3>

        <p className="mb-8">Set the prompt template to use.</p>

        <div className="collapse collapse-arrow bg-base-300 mb-2">
          <input
            type="radio"
            name="prompt-panels"
            checked={currentPromptPane == 0}
            onChange={(e) => setCurrentPromptPane(0)}
          />
          <div className="collapse-title text-xl font-medium">1 object</div>
          <div className="collapse-content">
            <textarea
              className={`textarea textarea-md textarea-primary w-full ${
                validateObjectTemplate(object1Template, 1)
                  ? "textarea-primary"
                  : "textarea-error"
              }`} // TODO: validate)}`}
              placeholder="{object} is a {color}"
              value={object1Template}
              onChange={(e) => setObject1Template(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="collapse collapse-arrow bg-base-300 mb-2">
          <input
            type="radio"
            name="prompt-panels"
            checked={currentPromptPane == 1}
            onChange={(e) => setCurrentPromptPane(1)}
          />
          <div className="collapse-title text-xl font-medium">2 objects</div>
          <div className="collapse-content">
            <textarea
              className={`textarea textarea-md textarea-primary w-full ${
                validateObjectTemplate(object2Template, 2)
                  ? "textarea-primary"
                  : "textarea-error"
              }`}
              placeholder="{object1} is a {color1}, {object2} is a {color2}"
              value={object2Template}
              onChange={(e) => setObject2Template(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="collapse collapse-arrow bg-base-300 mb-2">
          <input
            type="radio"
            name="prompt-panels"
            checked={currentPromptPane == 2}
            onChange={(e) => setCurrentPromptPane(2)}
          />
          <div className="collapse-title text-xl font-medium">
            3 or more objects
          </div>
          <div className="collapse-content">
            <textarea
              className={`textarea textarea-md textarea-primary w-full ${
                validateObjectTemplate(object3orMoreTemplate, 3)
                  ? "textarea-primary"
                  : "textarea-error"
              }`}
              placeholder="{object1} is a {color1}, {object2} is a {color2}, ..."
              value={object3orMoreTemplate}
              onChange={(e) => setObject3orMoreTemplate(e.target.value)}
            ></textarea>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      <h2 className="font-bold text-2xl mb-8">YOLO v8 / 物体検出モデル</h2>
      <p className="mb-8">
        currently used model is YOLO v8n (/models/yolov8n.onnx).
      </p>
      <div className="mb-8 grid md:grid-cols-3 gap-2">
        <h3 className="font-bold text-md mb-8 col-span-1">
          {InfoIcon(
            "Interval betwenn each inference / 生成後に次の推論を行うまでの秒数 "
          )}
          Inference Interval (ms): {inferenceInterval}
        </h3>
        <input
          type="range"
          min={0}
          max={4000}
          step={100}
          value={inferenceInterval}
          onChange={(e) => setInferenceInterval(Number(e.target.value))}
          className="range range-primary col-span-3 md:col-span-2"
        />
      </div>
      <div className="mb-8 grid md:grid-cols-3 gap-2">
        <h3 className="font-bold text-md mb-8 col-span-1">
          {InfoIcon("Number of boxes to be detected")}
          top-k (検出確率上位k件のみを表示): {topKVal}
        </h3>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={topKVal}
          onChange={(e) => settopK(Number(e.target.value))}
          className="range range-primary col-span-3 md:col-span-2"
        />
      </div>
      <div className="mb-8 grid md:grid-cols-3 gap-2">
        <h3 className="font-bold text-md mb-8 col-span-1">
          {InfoIcon("IOU (Intersection over Union) threshold to be detected")}
          IOU (検出画像の重なり度合い) Threshold: &gt;{iouThresholdVal}
        </h3>
        <input
          type="range"
          min={0}
          max={1.0}
          step={0.01}
          value={iouThresholdVal}
          onChange={(e) => setiouThreshold(Number(e.target.value))}
          className="range range-primary col-span-3 md:col-span-2"
        />
      </div>
      <div className="mb-8 grid md:grid-cols-3 gap-2">
        <h3 className="font-bold text-md mb-8 col-span-1">
          {InfoIcon("score (probability) threshold to be detected")}
          Score Threshold (確率の閾値): &gt;{scoreThresholdVal}
        </h3>
        <input
          type="range"
          min={0}
          max={1.0}
          value={scoreThresholdVal}
          step={0.01}
          onChange={(e) => setscoreThreshold(Number(e.target.value))}
          className="range range-primary col-span-3 md:col-span-2"
        />
      </div>

      <div className="divider"></div>

      <h2 className="font-bold text-2xl mb-8">Labels</h2>
      <div className="overflow-x-auto mb-8">
        <table className="table table-sm">
          <thead>
            <tr>
              {/* <th>Icon</th> */}
              <th>
                <div
                  className="tooltip tooltip-right"
                  data-tip="Labels set for YOLO model"
                >
                  Object Label
                </div>
              </th>
              <th>
                <div
                  className="tooltip tooltip-right"
                  data-tip="User-editable Label for Language Model AI"
                >
                  Name
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {labels.map((label, i) => (
              <tr key={i}>
                {/* <td>{labelsIconMap[label]}</td> */}
                <td>{label}</td>
                <td>
                  <input
                    type="text"
                    placeholder={`${label}の日本語`}
                    className="input input-primary w-full max-w-xs"
                    value={labelsJaLabelMap[label]}
                    onChange={(e) => {
                      const newLabelsJaLabelMap = { ...labelsJaLabelMap };
                      newLabelsJaLabelMap[label] = e.target.value;
                      setLabelsJaLabelMap(newLabelsJaLabelMap);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="divider"></div>
    </>
  );
};

const GPT4ImageCaptioningModeSettings = () => {
  const [prompts, setPrompts] = useAtom(descibeModeBasePromptsAtom);
  const resetPrompts = useResetAtom(descibeModeBasePromptsAtom);
  const [descInterval, setDescInterval] = useAtom(describeIntervalSecAtom);
  const [maxToken, setMaxToken] = useAtom(describeMaxTokenAtom);

  return (
    <div className="min-h-screen">
      <h2 className="font-bold text-2xl mb-8">Language Model Settings</h2>
      <div className="mb-8">
        <div className="mb-8 grid md:grid-cols-3 gap-2">
          <h3 className="font-bold text-md mb-8 col-span-1">
            {InfoIcon(
              "Interval betwenn each inference / 生成後に次の推論を行うまでの秒数 "
            )}
            Generation Interval (sec): {descInterval}
          </h3>
          <input
            type="range"
            min={30}
            max={300}
            step={5}
            value={descInterval}
            onChange={(e) => setDescInterval(Number(e.target.value))}
            className="range range-primary col-span-3 md:col-span-2"
          />
        </div>
        <div className="mb-8 grid md:grid-cols-3 gap-2">
          <h3 className="font-bold text-md mb-8 col-span-1">
            {InfoIcon("Upper limit of n tokens / 生成の最大トークン数 ")}
            max n of tokens: {maxToken}
          </h3>
          <input
            type="range"
            min={128}
            max={2048}
            step={2}
            value={maxToken}
            onChange={(e) => setMaxToken(Number(e.target.value))}
            className="range range-primary col-span-3 md:col-span-2"
          />
        </div>
      </div>
      <h2 className="font-bold text-2xl mb-8">Prompt</h2>
      <div className="mb-8">
        <h3 className="font-bold text-md mb-4">
          {InfoIcon("OpenAI secret token")}
          Prompt / 画像キャプション生成のためのプロンプト
        </h3>
        <p className="mb-8">
          画像説明の生成を行うためのプロンプト。画面下部で選択されているものが使用されます。
        </p>
        <div className="mb-8">
          <button
            className="btn btn-primary btn-md"
            onClick={(e) => {
              resetPrompts();
              alert(
                "Prompts reset to default / プロンプトをリセットしました。"
              );
            }}
          >
            <span className="icon icon-refresh mr-2"></span>
            Reset / リセット
          </button>
        </div>
        {prompts.map((prompt, idx) => (
          <>
            <p className="text-sm mb-4">Prompt {idx + 1}</p>
            <textarea
              className={`textarea textarea-lg textarea-bordered w-full mb-8`}
              value={prompt}
              key={idx}
              placeholder="input prompt here / プロンプトを入力してください"
              onChange={(e) => {
                const newPrompts = [...prompts];
                newPrompts[idx] = e.target.value;
                setPrompts(newPrompts);
              }}
            ></textarea>
          </>
        ))}
      </div>
      {/* <div className="mb-8">
        <h3 className="font-bold text-md mb-4">
          {InfoIcon("OpenAI secret token")}
          Role / GPT-4の役割
        </h3>
        <input
          type="text"
          placeholder="input your API token here"
          className="input input-primary w-full"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
      </div> */}
    </div>
  );
};

const SpeechTest = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState(
    "あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。"
  );
  const voice = useAtomValue(voiceAtom);
  const voicePitch = useAtomValue(voicePitchAtom);
  const voiceSpeed = useAtomValue(voiceSpeedAtom);

  const readAloud = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsPlaying(true);
      const uttr = new SpeechSynthesisUtterance();
      if (voice) uttr.voice = voice;
      uttr.lang = "ja-JP";
      uttr.pitch = voicePitch;
      uttr.volume = 1.0;
      uttr.rate = voiceSpeed;
      uttr.text = text;
      window.speechSynthesis.speak(uttr);
    }
  };
  const speakStop = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsPlaying(false);
      window.speechSynthesis.cancel();
    }
  };
  return (
    // play/pause icon to toggle the speech
    <div className="flex flex-row gap-4">
      <button
        className={"btn btn-primary btn-sm btn-outline"}
        onClick={(e) => {
          if (typeof window !== "undefined" && "speechSynthesis" in window) {
            if (window.speechSynthesis.speaking) {
              speakStop();
            } else {
              readAloud(text);
            }
          }
        }}
      >
        {isPlaying ? (
          <p className={`icon-[mdi--pause] w-5 h-5`} />
        ) : (
          <p className={`icon-[mdi--play] w-5 h-5`} />
        )}
        声をテストする
      </button>
      <input
        type="text"
        placeholder="サンプルテキスト"
        className="input input-bordered input-sm w-full flex-grow"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
};

/**
 *
 * @description This component is for main settings configuration
 */
export default function SettingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setCameraOn = useSetAtom(isCameraOn);
  const [token, setToken] = useAtom(apiKeyAtom);
  const [webhook, setWebhook] = useAtom(discordWebhookUrlAtom);

  const [currentTab, setCurrentTab] = useState(0);

  const [voice, setVoice] = useAtom(voiceAtom);
  const [voicePitch, setvoicePitch] = useAtom(voicePitchAtom);
  const [voiceSpeed, setvoiceSpeed] = useAtom(voiceSpeedAtom);
  const [voiceIndex, setVoiceIndex] = useAtom(voiceIndexAtom);

  const [systemPrompt, setSystemPrompt] = useAtom(llmSystemPromptAtom);
  const [initializePrompt, setInitializePrompt] = useAtom(initializePromptAtom);

  useEffect(() => {
    const mode = searchParams.get("mode");
    switch (mode) {
      case undefined:
        setCurrentTab(1);
      case "yolo":
        setCurrentTab(0);
        break;
      case "gpt4":
        setCurrentTab(1);
        break;
    }
  }, [searchParams]);

  useEffect(() => {
    if (document.fullscreenElement !== null) {
      document.exitFullscreen();
    }
  }, [document]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full flex justify-between flex-row">
        <h1 className="font-bold text-4xl mb-8">SETTINGS / 設定</h1>
        <button
          className="btn btn-primary btn-md"
          onClick={(e) => {
            setCameraOn(true);
            router.back();
          }}
        >
          Back to App / 戻る
        </button>
      </div>

      <div className="divider"></div>

      <div className="setting__Content mb-8">
        <div className="mb-8">
          <h3 className="font-bold text-xl mb-4">OpenAI API</h3>
          <p className="mb-8">
            Set the OpenAI API token to use the LLM. / OpenAI APIのsecret
            keyを取得してください。 &nbsp;
            <Link
              href="https://platform.openai.com/api-keys"
              className="underline"
              target="_blank"
            >
              https://platform.openai.com/api-keys
            </Link>
            . &nbsp;
          </p>
          <p className="mb-8">
            You can see how much you have used the API from following link /
            利用状況の確認はこちら &nbsp;
            <Link
              href="https://platform.openai.com/usage"
              className="underline"
              target="_blank"
            >
              https://platform.openai.com/usage
            </Link>
            . &nbsp;
          </p>
          <div className="label">
            <span className="label-text">
              Do not publish your API token to the public. /
              トークンは公開しないでください。
            </span>
          </div>
          <input
            type="text"
            placeholder="input your API token here"
            className="input input-bordered w-full"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>

        <div className="divider"></div>

        <h3 className="font-bold text-xl mb-4">Voice Settings / 声の設定</h3>
        <div className="mb-8 grid md:grid-cols-3 gap-2">
          <h3 className="font-bold text-md mb-8 col-span-1">
            {InfoIcon("自動音声の声の高さの設定です / Voice Pitch")}声 / Voice
          </h3>
          <select
            className="select select-primary w-full max-w-xs"
            value={voiceIndex}
            onChange={(e) => {
              const idx = e.target.value as any as number;
              setVoiceIndex(idx);
              setVoice(
                window.speechSynthesis
                  .getVoices()
                  .filter((v) => v.lang === "ja-JP")[idx]
              );
            }}
          >
            {window.speechSynthesis
              .getVoices()
              .filter((v) => v.lang === "ja-JP")
              .map((v, idx) => {
                return (
                  <option key={idx} value={idx}>
                    {v.name} {v.default && "(default)"}
                  </option>
                );
              })}
          </select>
        </div>
        <div className="mb-8 grid md:grid-cols-3 gap-2">
          <h3 className="font-bold text-md mb-8 col-span-1">
            {InfoIcon("自動音声の声の高さの設定です / Voice Pitch")}
            声の高さ / Voice Pitch: {voicePitch}
          </h3>
          <input
            type="range"
            min={0.1}
            max={3}
            step={0.05}
            value={voicePitch}
            onChange={(e) => setvoicePitch(Number(e.target.value))}
            className="range range-primary col-span-3 md:col-span-2"
          />
        </div>
        <div className="mb-8 grid md:grid-cols-3 gap-2">
          <h3 className="font-bold text-md mb-8 col-span-1">
            {InfoIcon("自動音声の声の高さの設定です / Voice Pitch")}
            発話スピード / Speech Speed: {voiceSpeed}
          </h3>
          <input
            type="range"
            min={0.1}
            max={3}
            step={0.05}
            value={voiceSpeed}
            onChange={(e) => setvoiceSpeed(Number(e.target.value))}
            className="range range-primary col-span-3 md:col-span-2"
          />
        </div>
        <div className="mb-8 grid md:grid-cols-3 gap-2">
          <div></div>
          <div className="col-span-3 md:col-span-2">
            <SpeechTest />
          </div>
        </div>

        <div className="divider"></div>

        <h3 className="font-bold text-xl mb-4">Webhook URL (Discord)</h3>
        <div className="mb-8">
          <p className="mb-8">Set the Webhook URL to the Discord Webhook.</p>
          <input
            type="url"
            placeholder="input Webhook URL"
            className="input input-bordered w-full"
            value={webhook}
            onChange={(e) => setWebhook(e.target.value)}
          />
        </div>

        <div className="divider"></div>

        <h3 className="font-bold text-xl mb-4">Initialize Prompt</h3>
        <div className="mb-8">
          <p className="mb-8">パフォーマンス開始時に用いるプロンプトです。</p>
          <input
            type="url"
            placeholder="input Webhook URL"
            className="input input-bordered w-full"
            value={initializePrompt}
            onChange={(e) => setInitializePrompt(e.target.value)}
          />
        </div>

        <div className="divider"></div>

        <h3 className="font-bold text-xl mb-4">System Prompt</h3>
        <div className="mb-8">
          <p className="mb-8">
            表示システムの制御のためのプロンプトです。設定したプロンプトに追記されて送信されます。
          </p>
          <input
            type="url"
            placeholder="input Webhook URL"
            className="input input-bordered w-full"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            disabled
          />
        </div>

        <div className="divider"></div>

        <h3 className="font-bold text-xl mb-4">Model Control</h3>

        <div
          role="tablist"
          className="tabs tabs-lifted grid-cols-2 tabs-sm md:tabs-lg p-0 w-full max-w-none"
        >
          <input
            type="radio"
            name="setting_tabs"
            role="tab"
            className={`tab`}
            aria-label="YOLO Mode"
            checked={currentTab === 0}
            onChange={(e) => setCurrentTab(0)}
          />
          <div
            role="tabpanel"
            className="tab-content bg-tab-bg w-full px-4 py-8"
          >
            <YoloModeSettings />
          </div>

          <input
            type="radio"
            name="setting_tabs"
            role="tab"
            className={`tab`}
            aria-label="GPT-4 Mode"
            checked={currentTab === 1}
            onChange={(e) => setCurrentTab(1)}
          />
          <div
            role="tabpanel"
            className="tab-content bg-tab-bg w-full px-4 py-8"
          >
            <GPT4ImageCaptioningModeSettings />
          </div>
        </div>
      </div>
    </div>
  );
}
