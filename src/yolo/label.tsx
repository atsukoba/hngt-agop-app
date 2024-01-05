export const labels = [
  "person",
  "bicycle",
  "car",
  "motorcycle",
  "airplane",
  "bus",
  "train",
  "truck",
  "boat",
  "traffic light",
  "fire hydrant",
  "stop sign",
  "parking meter",
  "bench",
  "bird",
  "cat",
  "dog",
  "horse",
  "sheep",
  "cow",
  "elephant",
  "bear",
  "zebra",
  "giraffe",
  "backpack",
  "umbrella",
  "handbag",
  "tie",
  "suitcase",
  "frisbee",
  "skis",
  "snowboard",
  "sports ball",
  "kite",
  "baseball bat",
  "baseball glove",
  "skateboard",
  "surfboard",
  "tennis racket",
  "bottle",
  "wine glass",
  "cup",
  "fork",
  "knife",
  "spoon",
  "bowl",
  "banana",
  "apple",
  "sandwich",
  "orange",
  "broccoli",
  "carrot",
  "hot dog",
  "pizza",
  "donut",
  "cake",
  "chair",
  "couch",
  "potted plant",
  "bed",
  "dining table",
  "toilet",
  "tv",
  "laptop",
  "mouse",
  "remote",
  "keyboard",
  "cell phone",
  "microwave",
  "oven",
  "toaster",
  "sink",
  "refrigerator",
  "book",
  "clock",
  "vase",
  "scissors",
  "teddy bear",
  "hair drier",
  "toothbrush",
] as const;

export type Label = (typeof labels)[number];

export const labelsIconMap: { [key in Label]: JSX.Element } = {
  person: <span className="icon-[mdi--home]" />,
  bicycle: <span className="icon-[mdi--human]" />,
  car: <span className="icon-[mdi--human]" />,
  motorcycle: <span className="icon-[mdi--human]" />,
  airplane: <span className="icon-[mdi--human]" />,
  bus: <span className="icon-[mdi--human]" />,
  train: <span className="icon-[mdi--human]" />,
  truck: <span className="icon-[mdi--human]" />,
  boat: <span className="icon-[mdi--human]" />,
  "traffic light": <span className="icon-[mdi--human]" />,
  "fire hydrant": <span className="icon-[mdi--human]" />,
  "stop sign": <span className="icon-[mdi--human]" />,
  "parking meter": <span className="icon-[mdi--human]" />,
  bench: <span className="icon-[mdi--human]" />,
  bird: <span className="icon-[mdi--human]" />,
  cat: <span className="icon-[mdi--human]" />,
  dog: <span className="icon-[mdi--human]" />,
  horse: <span className="icon-[mdi--human]" />,
  sheep: <span className="icon-[mdi--human]" />,
  cow: <span className="icon-[mdi--human]" />,
  elephant: <span className="icon-[mdi--human]" />,
  bear: <span className="icon-[mdi--human]" />,
  zebra: <span className="icon-[mdi--human]" />,
  giraffe: <span className="icon-[mdi--human]" />,
  backpack: <span className="icon-[mdi--human]" />,
  umbrella: <span className="icon-[mdi--human]" />,
  handbag: <span className="icon-[mdi--human]" />,
  tie: <span className="icon-[mdi--human]" />,
  suitcase: <span className="icon-[mdi--human]" />,
  frisbee: <span className="icon-[mdi--human]" />,
  skis: <span className="icon-[mdi--human]" />,
  snowboard: <span className="icon-[mdi--human]" />,
  "sports ball": <span className="icon-[mdi--human]" />,
  kite: <span className="icon-[mdi--human]" />,
  "baseball bat": <span className="icon-[mdi--human]" />,
  "baseball glove": <span className="icon-[mdi--human]" />,
  skateboard: <span className="icon-[mdi--human]" />,
  surfboard: <span className="icon-[mdi--human]" />,
  "tennis racket": <span className="icon-[mdi--human]" />,
  bottle: <span className="icon-[mdi--human]" />,
  "wine glass": <span className="icon-[mdi--human]" />,
  cup: <span className="icon-[mdi--human]" />,
  fork: <span className="icon-[mdi--human]" />,
  knife: <span className="icon-[mdi--human]" />,
  spoon: <span className="icon-[mdi--human]" />,
  bowl: <span className="icon-[mdi--human]" />,
  banana: <span className="icon-[mdi--human]" />,
  apple: <span className="icon-[mdi--human]" />,
  sandwich: <span className="icon-[mdi--human]" />,
  orange: <span className="icon-[mdi--human]" />,
  broccoli: <span className="icon-[mdi--human]" />,
  carrot: <span className="icon-[mdi--human]" />,
  "hot dog": <span className="icon-[mdi--human]" />,
  pizza: <span className="icon-[mdi--human]" />,
  donut: <span className="icon-[mdi--human]" />,
  cake: <span className="icon-[mdi--human]" />,
  chair: <span className="icon-[mdi--human]" />,
  couch: <span className="icon-[mdi--human]" />,
  "potted plant": <span className="icon-[mdi--human]" />,
  bed: <span className="icon-[mdi--human]" />,
  "dining table": <span className="icon-[mdi--human]" />,
  toilet: <span className="icon-[mdi--human]" />,
  tv: <span className="icon-[mdi--human]" />,
  laptop: <span className="icon-[mdi--human]" />,
  mouse: <span className="icon-[mdi--human]" />,
  remote: <span className="icon-[mdi--human]" />,
  keyboard: <span className="icon-[mdi--human]" />,
  "cell phone": <span className="icon-[mdi--human]" />,
  microwave: <span className="icon-[mdi--human]" />,
  oven: <span className="icon-[mdi--human]" />,
  toaster: <span className="icon-[mdi--human]" />,
  sink: <span className="icon-[mdi--human]" />,
  refrigerator: <span className="icon-[mdi--human]" />,
  book: <span className="icon-[mdi--human]" />,
  clock: <span className="icon-[mdi--human]" />,
  vase: <span className="icon-[mdi--human]" />,
  scissors: <span className="icon-[mdi--human]" />,
  "teddy bear": <span className="icon-[mdi--human]" />,
  "hair drier": <span className="icon-[mdi--human]" />,
  toothbrush: <span className="icon-[mdi--human]" />,
};

export const defaultLabelsJaLabelMap: { [key in Label]: string } = {
  person: "人間",
  bicycle: "自転車",
  car: "車",
  motorcycle: "バイク",
  airplane: "飛行機",
  bus: "バス",
  train: "電車",
  truck: "トラック",
  boat: "ボート",
  "traffic light": "信号機",
  "fire hydrant": "消火栓",
  "stop sign": "一時停止",
  "parking meter": "駐車メーター",
  bench: "ベンチ",
  bird: "鳥",
  cat: "猫",
  dog: "犬",
  horse: "馬",
  sheep: "羊",
  cow: "牛",
  elephant: "象",
  bear: "熊",
  zebra: "シマウマ",
  giraffe: "キリン",
  backpack: "バックパック",
  umbrella: "傘",
  handbag: "ハンドバッグ",
  tie: "ネクタイ",
  suitcase: "スーツケース",
  frisbee: "フリスビー",
  skis: "スキー板",
  snowboard: "スノーボード",
  "sports ball": "ボール",
  kite: "凧",
  "baseball bat": "バット",
  "baseball glove": "グローブ",
  skateboard: "スケートボード",
  surfboard: "サーフボード",
  "tennis racket": "テニスラケット",
  bottle: "ボトル",
  "wine glass": "ワイングラス",
  cup: "コップ",
  fork: "フォーク",
  knife: "ナイフ",
  spoon: "スプーン",
  bowl: "ボール",
  banana: "バナナ",
  apple: "りんご",
  sandwich: "サンドイッチ",
  orange: "オレンジ",
  broccoli: "ブロッコリー",
  carrot: "人参",
  "hot dog": "ホットドッグ",
  pizza: "ピザ",
  donut: "ドーナツ",
  cake: "ケーキ",
  chair: "椅子",
  couch: "ソファ",
  "potted plant": "植木",
  bed: "ベッド",
  "dining table": "テーブル",
  toilet: "トイレ",
  tv: "テレビ",
  laptop: "ノートパソコン",
  mouse: "マウス",
  remote: "リモコン",
  keyboard: "キーボード",
  "cell phone": "携帯電話",
  microwave: "電子レンジ",
  oven: "オーブン",
  toaster: "トースター",
  sink: "シンク",
  refrigerator: "冷蔵庫",
  book: "本",
  clock: "時計",
  vase: "花瓶",
  scissors: "はさみ",
  "teddy bear": "テディベア",
  "hair drier": "ドレッサー",
  toothbrush: "歯ブラシ",
};
