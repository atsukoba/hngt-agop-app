import Link from "next/link";

export default function App() {
  return (
    <div
      className="w-full min-h-screen bg-base-200 relative"
      style={{
        backgroundImage: "url(/images/agop_forest.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex justify-center items-center max-w-full min-h-screen text-left">
        <div className="p-8 md:max-w-4xl max-w-full">
          <h1 className="my-6 text-5xl font-mono font-bold">
            AGOP: A Garden of Prosthesis AI App 2024
          </h1>
          <p className="my-6 italic animate-in fade-in-5">
            庭とは、さまざまな動植物や石たちがせめぎ合い、折衝しながら共生しているいわば宇宙の縮図のような場である。
            <Link href={"https://hbh.center/04-issue_05/"}>*</Link>
            このパフォーマンスでは、その庭という概念を拡張し、石や樹木だけでなく道具や機械、AIや仮想オブジェクト、人間の肉体をも含むものたちが等価に存在し、互いが互いを《義肢》としながら混じり合い、その関係を捻転させてゆく庭：”義肢の庭”《A
            Garden of Prosthesis》(AGOP)を生成することを試みる。
          </p>
          <p className="my-6 italic">
            この資本主義社会の中で、掃除機は手に持って埃を吸うために、樹木は木材かCO2を吸収するために、この肉体は労働し生産性を生み出すためにある。物/者たちの存在意義は「正常に」収束し、やがてそのほかの意味を想像できなくなってゆく。我々は人間性と生産性に基づく関係の檻の中にいる。
          </p>
          <p className="my-6 italic">
            この《庭》では、理性的な人間たちが他物たちを利用するという関係を逸脱し、オブジェクトたちが《庭師》によってマゾヒスティックに、あるいはキメラ的に《接木》され、癒合する。それによって、この「正常な社会」の内部に、捻れた関係の裂け目としての島宇宙的な外部を生成することを試みる。そして、その周囲にあるものすべてを－あなたを－この《庭》へと巻き込みながら、その裂け目としての外部へと躍り出る！
          </p>
          <div className="flex flex-row justify-center my-6">
            <button className="btn btn-outline font-light">
              <Link href={"/v8"} className="text-2xl align-middle">
                START &nbsp;
                <span className="text-2xl">ver:YOLO-v8</span>
              </Link>
            </button>
          </div>
          <div className="flex flex-row justify-center my-6">
            <button className="btn btn-outline font-light">
              <Link href={"/llm"} className="text-2xl align-middle">
                START &nbsp;
                <span className="text-2xl">ver:GPT-4 Description</span>
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
