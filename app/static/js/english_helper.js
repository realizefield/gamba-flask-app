// english_helper.js (単語メモポップアップ安定版)

(function () {
    "use strict";

    // --- データ定義 (DICTIONARY, SENTENCES, QUIZ_PASSAGE, QUESTIONS, STRUCT_INFOS) ---

    // 重要単語ミニ辞書
    const DICT = {
        emotional: { reading: "エ【モ】ウショナル", meaning: "感情的な、精神的な", example: "their emotional health was measured.", note: "" },
        decrease: { reading: "ディ【ク】リース", meaning: "減少、低下", example: "a decrease in communication", note: "" },
        communication: { reading: "コミュ【ニ】ケーション", meaning: "連絡、意思の疎通", example: "communication with family and friends", note: "" },
        lessening: { reading: "【レ】スニング", meaning: "少なくすること、減少", example: "this lessening of communication", note: "" },
        related: { reading: "リ【レ】イティド", meaning: "関連した、関係した", example: "related directly to the amount of time", note: "" },
        interpersonal: { reading: "【イ】ンター【パ】ースナル", meaning: "対人関係の、個人間の", example: "less interpersonal communication", note: "" },
        loneliness: { reading: "【ロ】ウンリネス", meaning: "孤独、寂しさ", example: "a greater feeling of loneliness", note: "" },
        sadness: { reading: "【サ】ッドネス", meaning: "悲しさ、悲しみ", example: "loneliness causes sadness", note: "" },
        involved: { reading: "イン【ヴォ】ルヴド", meaning: "関わっている、参加している", example: "one researcher involved in the study", note: "" },
        director: { reading: "ダィ【レ】クター", meaning: "所長、責任者", example: "director of the university's IT Center", note: "" },
        expected: { reading: "イク【スペ】クティド", meaning: "予想した、期待した", example: "had expected Internet users to feel happier", note: "" },
        wider: { reading: "【ワ】イダー", meaning: "より広い", example: "a wider range of people", note: "" },
        range: { reading: "【レ】インジ", meaning: "範囲、幅", example: "a wider range of people", note: "" },
        concern: { reading: "コン【サ】ーン", meaning: "懸念、心配", example: "cause concern", note: "" },
        urged: { reading: "【ア】ージド", meaning: "強く勧めた、促した", example: "he urged people to use good judgment", note: "" },
        judgment: { reading: "【ジャ】ッジメント", meaning: "判断、意見", example: "use good judgment", note: "" },
        suggested: { reading: "サ【ジェ】スティド", meaning: "提案した", "example": "He suggested placing the computer ...", note: "" },
        limit: { reading: "【リ】ミット", meaning: "制限する、限定する", example: "limit the amount of time", note: "" }
    };

    const SENTENCES = [
        "A new study from an American university says that using the Internet for even a few hours a week makes people feel (1).",
        "Ninety-three families who used the Internet at home were studied for two years, and their emotional health (S) was measured (V).",
        "Those studied reported a decrease in communication with family and friends.",
        "Researchers said that this lessening of communication related directly to the amount of time spent using the Internet.",
        "One researcher said that this is because the people using the Internet during the study spent less time in important personal relationships with family and friends.",
        "With less interpersonal communication comes a greater feeling of loneliness, and loneliness causes sadness, noted one researcher involved in the study.",
        "William Scherlis, director of the university's Informational Technology Center and research team member, said the team was (3) by the results of the study.",
        "He said that the research team members had expected Internet users to feel happier and more involved with a wider range of people because using the Internet is an activity that involves communication.",
        "Should the results of this study cause concern?",
        "Mr. Scherlis said it would be wrong to decide that the Internet is a bad thing;",
        "however, he urged people to use good judgment about how they use it.",
        "He suggested, for example, placing the computer in a center of activity in the home so that the user would not be alone in a room away from other people.",
        "He also (4) suggested that people limit the amount of time they spend on the Internet.",
        "The researchers are planning to continue their research (5) of the Internet,",
        "They would also like to learn if watching television causes the same effects."
    ];

    const JP_TRANSLATIONS = [
        "アメリカのある大学による新しい研究によれば、インターネットを週に数時間使うだけでも、人は（1）と感じるようになるという。",
        "家庭でインターネットを使っている93世帯が2年間調査され、その精神的な健康が測定された。",
        "調査対象者たちは、家族や友人とのコミュニケーションの減少を報告した。",
        "研究者らは、このコミュニケーションの減少は、インターネットの使用に費やした時間と直接関連していると述べた。",
        "ある研究者は、これは、研究中にインターネットを使っている人々が、家族や友人との重要な個人的な人間関係に費やす時間が少なくなったためだと述べた。",
        "人と人とのコミュニケーションが減ると、より大きな孤独感が伴い、そして孤独は悲しさを引き起こすと、その研究に関わったある研究者は指摘した。",
        "同大学の情報技術センター所長で調査チームのメンバーであるウィリアム・シャーリス氏は、チームがその研究結果に（3）させられたと述べた。",
        "彼は、研究チームのメンバーたちは、インターネットの利用はコミュニケーションを伴う活動であるため、インターネット利用者はより幸せに、より幅広い人々と関わりを持つだろうと予想していた、と述べた。",
        "この研究結果は懸念を引き起こすべきだろうか。",
        "シャーリス氏は、インターネットが悪いものだと断定するのは間違いであろうと述べた。",
        "しかしながら、彼は人々にインターネットの利用方法について良識ある判断をするよう促した。",
        "例えば、彼は、利用者が他の人から離れた部屋で一人にならないように、コンピューターを家庭の活動の中心に置くことを提案した。",
        "彼はまた、人々がインターネットに費やす時間を制限することを提案した。",
        "研究者たちは、インターネットの影響についてさらに知るために、研究を続けることを計画している。",
        "彼らはまた、テレビを見ることが同じ影響を引き起こすかどうかも知りたいと思っている。"
    ];

    const STRUCT_INFOS = [
        {
            display: `【文の構成と文法事項】
<strong>A new study from an American university</strong> (S)
  <strong>says</strong> (V)
  <strong>that</strong> using the Internet for even a few hours a week <strong>makes</strong> people <strong>feel</strong> (1).（<strong>that節</strong>）

* <strong>that節</strong>：that 以下が「〜ということを述べている」という内容を表す名詞節。
* <strong>using the Internet...</strong>：動名詞句で that 節の中の主語。
* <strong>make O V</strong>：『SはOにVさせる』(使役動詞)。この場合 O は <strong>people</strong>、V は <strong>feel</strong>。

【重要表現・熟語】
* <strong>make 人 feel 形容詞</strong>：人を〜と感じさせる
* <strong>for even a few hours a week</strong>：週にたとえ数時間だけでも`,
            speak: `第一文は、アメリカの大学の新しい研究が何を主張しているかを示しています。that 以下が研究の内容で、インターネットを週に少し使うだけでも、人をある感情にさせる、という構造になっています。`
        },
        {
            display: `【文の構成と文法事項】
<strong>Ninety-three families who used the Internet at home</strong> (S)
  <strong>were studied</strong> (V: 受動態) for two years,
<strong>and</strong> their emotional health (S) <strong>was measured</strong> (V).

* <strong>who used the Internet at home</strong>：関係代名詞節で <strong>families</strong> を修飾。
* <strong>were studied</strong>, <strong>was measured</strong>：いずれも受動態で「調査された」「測定された」。

【重要表現・熟語】
* <strong>Ninety-three families</strong>：93世帯
* <strong>emotional health</strong>：精神的な健康`,
            speak: `第二文は、どんな人たちをどれくらいの期間調べたのかを説明している文です。93世帯が2年間調査され、その精神的な健康が測定されたことを押さえましょう。`
        },
        {
            display: `【文の構成と文法事項】
<strong>Those studied</strong> (S) <strong>reported</strong> (V) <strong>a decrease in communication with family and friends</strong> (O).

* <strong>Those studied</strong>：<strong>the people who were studied</strong> の省略形で「調査された人たち」。
* <strong>a decrease in communication with A and B</strong>：AやBとのコミュニケーションの減少。

【重要表現・熟語】
* <strong>those studied</strong>：調査対象者
* <strong>a decrease in ～</strong>：～の減少`,
            speak: `第三文では、調査された人たちが家族や友人とのコミュニケーションが減ったと報告したことを述べています。Those studied という言い換え表現に注目です。`
        },
        {
            display: `【文の構成と文法事項】
<strong>Researchers</strong> (S) <strong>said</strong> (V) <strong>that</strong>
  this lessening of communication (S)
  <strong>related</strong> (V) directly <strong>to</strong> the amount of time spent using the Internet.

* <strong>that 節</strong>：<strong>said</strong> の目的語となる名詞節。
* <strong>the amount of time spent using the Internet</strong>：
    <strong>spent</strong> が <strong>time</strong> を修飾し「インターネットの使用に費やされた時間」。

【重要表現・熟語】
* <strong>lessening of ～</strong>：～の減少
* <strong>relate directly to ～</strong>：～と直接関係している
* <strong>the amount of time spent ～ing</strong>：～するのに費やされた時間`,
            speak: `第四文は、「このコミュニケーションの減少は、インターネットに費やした時間と直接結びついている」と説明しています。spent が time を修飾している点を確認しましょう。`
        },
        {
            display: `【文の構成と文法事項】
<strong>One researcher</strong> (S) <strong>said</strong> (V) <strong>that</strong>
  this <strong>is because</strong>
  the people <strong>using the Internet</strong> during the study (S)
  <strong>spent</strong> (V) less time in important personal relationships with family and friends.

* <strong>this is because ～</strong>：「これは〜だからだ」。
* <strong>people using the Internet</strong>：<strong>using</strong> は現在分詞で <strong>people</strong> を修飾。
* <strong>spend</strong> (時間) <strong>in</strong> (活動)：(活動)に(時間)を費やす。

【重要表現・熟語】
* <strong>this is because ～</strong>：これは〜だからだ
* <strong>spend time in ～</strong>：～に時間を費やす`,
            speak: `第五文では、「インターネットを使っている人たちが、家族や友人との重要な関係に費やす時間を減らしたからだ」と理由を説明しています。this is because の形で理由を表しています。`
        },
        {
            display: `【文の構成と文法事項】
<strong>With less interpersonal communication comes</strong> a greater feeling of loneliness (S),
<strong>and</strong> loneliness (S) <strong>causes</strong> (V) sadness (O),
<strong>noted</strong> one researcher involved in the study.

* <strong>With ... comes ...</strong>：<strong>倒置</strong>。通常語順は A greater feeling of loneliness comes with less interpersonal communication.
* <strong>noted one researcher...</strong>：<strong>分詞構文</strong>。挿入句的に「と、その研究に関わったある研究者は指摘した」。

【重要表現・熟語】
* <strong>interpersonal communication</strong>：対人コミュニケーション
* <strong>a greater feeling of loneliness</strong>：より大きな孤独感
* <strong>cause sadness</strong>：悲しさを引き起こす`,
            speak: `第六文では、対人コミュニケーションが減ると孤独感が強まり、その孤独が悲しさを生むと説明しています。with ～ comes ... の倒置構文に注意しましょう。`
        },
        {
            display: `【文の構成と文法事項】
<strong>William Scherlis</strong>, <strong>director</strong> of the university's... <strong>and research team member</strong> (S)
  <strong>said</strong> (V) the team <strong>was</strong> (3) <strong>by</strong> the results of the study.

* <strong>director ... and research team member</strong>：<strong>同格</strong>で William Scherlis を説明。
* <strong>was</strong> (3) <strong>by</strong> ～：<strong>受動態</strong>。「〜によって（3）の状態にさせられた」。

【重要表現・熟語】
* <strong>director</strong>：所長、責任者
* <strong>research team member</strong>：調査チームのメンバー`,
            speak: `第七文は、シャーリス氏が『チームは研究結果にとても驚いた』と述べている文です。名前のあとに続く説明が同格になっているところも確認しておきましょう。`
        },
        {
            display: `【文の構成と文法事項】
<strong>He</strong> (S) <strong>said</strong> (V) <strong>that</strong>
  the research team members (S)
  <strong>had expected</strong> (V: <strong>過去完了</strong>)
  <strong>Internet users</strong> (O) <strong>to feel</strong> (C) happier <strong>and</strong> more involved with a wider range of people
  <strong>because</strong> using the Internet is an activity that involves communication.

* <strong>had expected</strong>：過去完了「（過去の時点よりも前に）予想していた」。
* <strong>expect O to V</strong>：OがVすると予想する。
* <strong>a wider range of people</strong>：より広い範囲の人々。

【重要表現・熟語】
* <strong>expect O to V</strong>：OがVするだろうと予想する
* <strong>a wider range of people</strong>：より幅広い人々`,
            speak: `第八文では、研究チームが「インターネットはコミュニケーションの活動なので、利用者はもっと幸せになり、より多くの人と関わるだろう」と予想していたことが説明されています。expect O to V と過去完了 had expected に注目です。`
        },
        {
            display: `【文の構成と文法事項】
<strong>Should</strong> the results of this study <strong>cause</strong> concern?

* <strong>Should ～?</strong>：『〜すべきか？』という疑問。

【重要表現・熟語】
* <strong>cause concern</strong>：懸念を引き起こす`,
            speak: `第九文は、『この研究結果は本当に心配するべきなのだろうか』と読者に問いかける疑問文です。should を使った丁寧な表現です。`
        },
        {
            display: `【文の構成と文法事項】
<strong>Mr. Scherlis</strong> (S) <strong>said</strong> (V) <strong>it would be wrong to decide</strong> that the Internet is a bad thing.

* <strong>it would be wrong to V</strong>：Vするのは間違いだろう。（it は形式主語）
* <strong>to decide that S V</strong>：SがVだと判断すること。（to decide 以下が真主語）

【重要表現・熟語】
* <strong>it would be wrong to V</strong>：Vするのは間違いだろう
* <strong>decide that S V</strong>：SがVだと判断する`,
            speak: `第十文では、『インターネットは悪いものだと決めつけるのは間違いだ』というバランスの取れた見方が示されています。it would be wrong to decide that ～ のまとまりで覚えましょう。`
        },
        {
            display: `【文の構成と文法事項】
<strong>however</strong>, <strong>he</strong> (S) <strong>urged</strong> (V) <strong>people</strong> (O) <strong>to use</strong> (C) good judgment <strong>about</strong> how they use it.

* <strong>urge 人 to V</strong>：人にVするよう<strong>強く勧める</strong>。
* <strong>how they use it</strong>：<strong>about</strong> の目的語となる従属節で「彼らがどのようにそれを使うか」。

【重要表現・熟語】
* <strong>however</strong>：しかしながら
* <strong>urge 人 to V</strong>：人にVするように強く促す
* <strong>use good judgment</strong>：良識ある判断をする`,
            speak: `第十一文では、『しかし、インターネットの使い方については良識ある判断をするように』と人々に強く勧めています。urge 人 to V の形がポイントです。`
        },
        {
            display: `【文の構成と文法事項】
<strong>He</strong> (S) <strong>suggested</strong> (V), for example,
  <strong>placing</strong> (O: <strong>動名詞</strong>) the computer in a center of activity in the home
  <strong>so that</strong> the user <strong>would not be alone</strong> in a room away from other people.

* <strong>suggest ～ing</strong>：〜することを提案する。
* <strong>so that S V</strong>：SがVするように（目的）。

【重要表現・熟語】
* <strong>suggest ～ing</strong>：〜することを提案する
* <strong>so that S V</strong>：SがVするように（目的）
* <strong>in a center of activity</strong>：活動の中心に`,
            speak: `第十二文では、具体例として「パソコンを家の活動の中心に置く」ことを提案しています。so that the user would not be alone の部分が、目的を表していることを確認しましょう。`
        },
        {
            display: `【文の構成と文法事項】
<strong>He</strong> (S) <strong>also suggested</strong> (V) <strong>that</strong> people limit the amount of time they spend on the Internet.

* <strong>suggest that S V</strong>：SがVすることを提案する。
* <strong>limit the amount of time</strong>：〜する時間を制限する。

【重要表現・熟語】
* <strong>suggest that S V</strong>：SがVすることを提案する
* <strong>limit the amount of time ～</strong>：～する時間を制限する`,
            speak: `第十三文では、「インターネットに費やす時間を制限すること」を提案しています。suggest that people limit の形と、the amount of time they spend on the Internet のかたまりを押さえましょう。`
        },
        {
            display: `【文の構成と文法事項】
<strong>The researchers</strong> (S) <strong>are planning</strong> (V) <strong>to continue</strong> their research <strong>in order to find out</strong> more about the effects of the Internet.

* <strong>be planning to V</strong>：Vする予定である。
* <strong>in order to V</strong>：Vするために（目的）。

【重要表現・熟語】
* <strong>in order to V</strong>：Vするために
* <strong>find out</strong>：調べる、突き止める
* <strong>the effects of ～</strong>：～の影響`,
            speak: `第十四文では、研究者たちがインターネットの影響についてさらに調べるために研究を続ける予定であることが述べられています。in order to find out の目的表現に注目しましょう。`
        },
        {
            display: `【文の構成と文法事項】
<strong>They</strong> (S) <strong>would also like to learn</strong> (V) <strong>if</strong> watching television causes the same effects.

* <strong>would like to V</strong>：Vしたいと思う。
* <strong>learn if S V</strong>：SがVするかどうか知る。
* <strong>watching television</strong>：動名詞で主語扱い。

【重要表現・熟語】
* <strong>would like to learn</strong>：知りたいと思う
* <strong>learn if S V</strong>：SがVかどうか知る`,
            speak: `最後の文では、「テレビを見ることが同じ影響をもたらすかどうかも知りたい」と述べています。would like to learn if ～ の形をまとめて覚えておきましょう。`
        }
    ];

    const QUIZ_PASSAGE = `
        Television has long been criticized because it shows violence, which influences, especially, younger people. For years, critics of television have looked at the issue of the program content particularly violence as it affects viewers. The problem seems especially serious with younger children. TV in fact makes people (1) more violence in everyday life. Critics point out that television presents violence as being normal and commonplace.

        However, recent criticism of television has changed its focus from the subject matter to the experience of the medium itself. The problem with TV now is not just (2) . The way children watch it in the family circle is more important. It is becoming common for children to watch television by themselves. With no one there to talk to about what is happening on the screen, children cannot easily distinguish between reality and fantasy.

        (3) However, the worst aspect of television is the way it can influence family life. Instead of being a focus for family activity, TV often becomes a substitute for it. It takes (4a) most of the work of a surrogate parent. Children depend (4b) the box to tell them what the world is like. When children are exposed to hours of television, they have no other choice but to go (4c) the "television experience" and survive. Already there are movements to try to stop or ban TV advertising which is directed at children under a certain age.

        (4d) the end, some people believe that removal of TV from the lives of children may be a solution. This may not be a practical solution, however. Instead, families should try to learn how to limit the amount of time children spend watching television and how to help them understand what they see.
    `;

    const QUESTIONS = [
        {
            id: 'q1',
            text: '空所(1) に入れるのに最も適当なものを、次のア~エから1つ選びなさい。',
            type: 'choice',
            options: ['ア. accept', 'イ. to accept', 'ウ. control', 'エ. to control'],
            correctAnswer: 'ア',
            explanation: `
                空所を含む文は「TV in fact makes people (1) more violence in everyday life.」です。
                動詞 make は「SVO（原形不定詞）」の形で「Oに〜させる」という使役動詞として機能します。
                したがって、空所(1)には動詞の原形が入ります。
                文脈は、テレビが暴力行為を「正常で一般的」なものとして提示することで、人々が暴力を「受け入れる」ようになるという流れですので、「受け入れる」という意味の **ア. accept** が適切です。
            `
        },
        {
            id: 'q2',
            text: '下線部(2)の語(句)を文意が通るように並べ換えなさい。',
            type: 'reorder',
            words: ['how', 'what', 'is seen', 'is seen', 'but', 'it'],
            correctAnswer: 'what is seen but how it is seen',
            explanation: `
                空所を含む文は「The problem with TV now is not just (2) .」
                直後に「The way children watch it...」（子供たちがそれを見る方法）という説明が続くことから、「〜だけでなく〜」という意味の **not just A but B** の構文が隠れていると判断できます。
                **A** には「見られる内容」(what is seen) が、**B** には「見られる方法」(how it is seen) が入ると、文脈（主題から媒体の経験への焦点の変化）に合致します。
                解答は **what is seen but how it is seen** です。
            `
        },
        {
            id: 'q3',
            text: '下線部(3)を日本語に訳しなさい。',
            type: 'translation',
            sentence: 'However, the worst aspect of television is the way it can influence family life.',
            correctAnswer: 'しかしながら、テレビの最も悪い側面は、それが家族生活に影響を与えかねないやり方である。',
            explanation: `
                **However**：しかしながら。
                **the worst aspect of television**：テレビの最も悪い側面。
                **is the way**：やり方である。
                **it can influence family life**：それが家族生活に影響を与えうる（与えかねない）。
            `
        },
        {
            id: 'q4',
            text: '空所(4a)〜(4d)に入れるのに最も適当なものを、次のア〜エからそれぞれ1つずつ選びなさい。',
            type: 'multiple_choice',
            options: ['ア. in', 'イ. on', 'ウ. over', 'エ. through'],
            parts: [
                { part: '(4a)', answer: 'ア', explanation: `(4a) taking ( ) most of the work: 「仕事のほとんどを引き受ける」という意味の句動詞 **take in**（取り込む、吸収する、引き受ける）が最も適切です。` },
                { part: '(4b)', answer: 'イ', explanation: `(4b) depend ( ) the box: 「〜に依存する」という熟語は **depend on** または depend upon です。` },
                { part: '(4c)', answer: 'エ', explanation: `(4c) go ( ) the "television experience" and survive: 「〜を経験する」「〜を通り抜けて生き残る」という意味の句動詞 **go through**（経験する、切り抜ける）が最も適切です。` },
                { part: '(4d)', answer: 'ア', explanation: `(4d) ( ) the end, some people...: 「結局のところ」「最終的には」という意味の熟語は **in the end** です。` }
            ]
        },
        {
            id: 'q5',
            text: '本文の内容と一致するものを、次のア〜オから2つ選びなさい。',
            type: 'multiple_select',
            options: ['ア. Television has long been criticized because it shows violence, which influences, especially, younger people.', 'イ. Recent criticism of television has focused on the violent acts that it promotes.', 'ウ. The presence of TV may strengthen the family by giving more time to spend together.', 'エ. Some people are trying to ban TV advertising directed at younger children.', 'オ. The writer believes that television should be removed from the lives of children.'],
            correctAnswers: ['ア', 'エ'],
            explanation: `
                **ア. 正しい。** 「For years, critics of television have looked at the issue of the program content particularly violence as it affects viewers. The problem seems especially serious with younger children」とあり、長年にわたり暴力が若い人々に影響を与えることで批判されてきた、という内容と一致します。
                **イ. 間違い。** 最近の批判は、暴力行為（主題）から「媒体の経験」へ焦点を変えたと述べています。「暴力行為に焦点を当てた」という記述は内容と一致しません。
                **ウ. 間違い。** テレビは「代理の親」となって「家族生活に影響を与える」とあり、家族の結びつきを弱める原因として述べられています。
                **エ. 正しい。** 「Already there are movements to try to stop or ban TV advertising which is directed at children under a certain age」とあり、幼い子供向けのテレビ広告を禁止しようとする運動があるという内容と一致します。
                **オ. 間違い。** 筆者は、テレビの撤廃（removal）は「This may not be a practical solution」（現実的な解決策ではないかもしれない）と述べており、撤廃を主張しているわけではありません。
            `
        }
    ];
    
    // --- (省略) 共通ユーティリティ (ポップアップ変数, clearPopup, makePopupBase, speak... 関数) ---
    // (これらは、前回の最終コードと同じで、このファイルの末尾に続けています)

    let wordPopup = null;
    let transPopup = null;
    let structPopup = null;
    let fullTransPopup = null; 

    function clearPopup(popup) {
        if (popup && popup.parentNode) {
            popup.parentNode.removeChild(popup);
        }
    }
    
    function clearAllPopups() {
        clearPopup(wordPopup);
        clearPopup(transPopup);
        clearPopup(structPopup);
        clearPopup(fullTransPopup);
    }

    function makePopupBase(anchor) {
        clearAllPopups(); // ポップアップ生成時に毎回クリアする

        const popup = document.createElement("div");
        popup.style.position = "absolute";
        popup.style.zIndex = "1000";
        popup.style.padding = "10px";
        popup.style.border = "1px solid #7aa7ff";
        popup.style.borderRadius = "8px";
        popup.style.background = "#fff";
        popup.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
        popup.style.maxWidth = "500px"; 
        popup.style.width = "auto";
        popup.style.whiteSpace = "pre-wrap"; 
        popup.style.fontSize = "0.85rem";
        popup.style.fontFamily = "sans-serif"; 

        const rect = anchor.getBoundingClientRect();
        popup.style.left = `${window.scrollX + rect.left}px`;
        popup.style.top = `${window.scrollY + rect.bottom + 5}px`;

        document.body.appendChild(popup);
        return popup;
    }

    let rateEn = 1.0;
    let rateJa = 1.0;

    function stopSpeak() {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
    }

    function speakWith(text, lang, rate) {
        if (!window.speechSynthesis) return;
        stopSpeak();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = lang;
        u.rate = rate;
        window.speechSynthesis.speak(u);
    }

    function speakEn(text) {
        speakWith(text, "en-US", rateEn);
    }

    function speakJa(text) {
        speakWith(text, "ja-JP", rateJa);
    }


    /*****************************************************************
     * 1. 📚 長文読解・学習モードの関数
     *****************************************************************/

    function getStructureInfo(index) {
        return STRUCT_INFOS[index] || {
            display: "【読解のポイント】この文の解説はまだ登録されていません。",
            speak: "この文の解説はまだ登録されていません。"
        };
    }
    
    function addWordToVocab(word) {
        // 仮の生徒IDと出典を設定 (Flask環境で認証情報を使用する場合はここを修正)
        const studentId = 'student01';
        const source = 'miyazaki_01'; 
        
        // 実際には Flask の /api/add_word に送信
        fetch('/api/add_word', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                student_id: studentId,
                word: word,
                source: source
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`✅ 単語「${word}」を暗記すべき単語に追加しました！`);
            } else {
                alert(`❌ 単語「${word}」の追加に失敗しました: ${data.message || 'サーバーエラー'}`);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('❌ サーバーとの通信に失敗しました。（Flaskの /api/add_word が起動しているか確認してください）');
        });
    }


    function showWordPopup(anchor, word) {
        clearAllPopups(); 

        const data = DICT[word];
        // DICTにない単語の場合は何もしない（青い単語のみポップアップを出す）
        if (!data) return; 

        wordPopup = makePopupBase(anchor);
        
        let content = `【単語】<strong>${word}</strong>\n`;
        content += `読み方: ${data.reading}\n`;
        content += `意味: <strong>${data.meaning}</strong>\n`;
        content += `例文: <em>${data.example}</em>`;

        wordPopup.innerHTML = content
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // --- ボタンエリア ---
        const btnContainer = document.createElement('div');
        btnContainer.style.marginTop = '10px';
        btnContainer.style.borderTop = '1px solid #eee';
        btnContainer.style.paddingTop = '6px';
        
        const readBtn = document.createElement("button");
        readBtn.textContent = "🔊 英語発音";
        readBtn.style.fontSize = "0.75rem";
        readBtn.style.borderRadius = "999px";
        readBtn.style.border = "1px solid #ccc";
        readBtn.style.background = "#fff";
        readBtn.style.padding = "2px 8px";
        readBtn.style.marginRight = "6px";
        readBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            speakEn(word);
        });
        
        // 単語メモ追加ボタン
        const vocabBtn = document.createElement("button");
        vocabBtn.textContent = "📝 暗記すべき単語に追加";
        vocabBtn.style.fontSize = "0.75rem";
        vocabBtn.style.borderRadius = "999px";
        vocabBtn.style.border = "1px solid #0066cc";
        vocabBtn.style.background = "#eef6ff";
        vocabBtn.style.color = "#0066cc";
        vocabBtn.style.padding = "2px 8px";
        vocabBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            addWordToVocab(word); // API呼び出し
            clearAllPopups();
        });

        btnContainer.appendChild(readBtn);
        btnContainer.appendChild(vocabBtn);
        wordPopup.appendChild(btnContainer);
        // --- ボタンエリア終了 ---
    }

    // showTransPopup, showStructPopup, showFullTranslation, setupStudyMode は省略

    function showTransPopup(anchor, index, sentence) {
        clearAllPopups();
        
        transPopup = makePopupBase(anchor);
        const jp = JP_TRANSLATIONS[index] || "この文の日本語訳はまだ登録されていません。";
        
        const content = document.createElement("div");
        content.innerHTML = `【英文】\n${sentence}\n<br><br>【日本語訳】\n<strong>${jp}</strong>`;
        transPopup.appendChild(content);
    }

    function showStructPopup(anchor, index) {
        clearAllPopups();

        structPopup = makePopupBase(anchor);
        const info = STRUCT_INFOS[index];

        const body = document.createElement("div");
        body.innerHTML = info.display.replace(/\n/g, '<br>');
        structPopup.appendChild(body);

        const btn = document.createElement("button");
        btn.textContent = "🔊 説明を聞く";
        btn.style.marginTop = "6px";
        btn.style.fontSize = "0.75rem";
        btn.style.borderRadius = "999px";
        btn.style.border = "1px solid #7aa7ff";
        btn.style.background = "#fff";
        btn.style.padding = "2px 8px";
        btn.addEventListener("click", function (e) {
            e.stopPropagation();
            speakJa(info.speak);
        });
        const hr = document.createElement("hr");
        hr.style.margin = "6px 0";
        structPopup.appendChild(hr);
        structPopup.appendChild(btn);
    }

    function showFullTranslation() {
        if (fullTransPopup) {
            clearPopup(fullTransPopup);
            fullTransPopup = null;
            return;
        }
        
        clearAllPopups();

        const popup = document.createElement("div");
        popup.style.position = "fixed";
        popup.style.top = "50%";
        popup.style.left = "50%";
        popup.style.transform = "translate(-50%, -50%)";
        popup.style.zIndex = "2000"; 
        popup.style.padding = "20px";
        popup.style.width = "90%";
        popup.style.maxWidth = "800px";
        popup.style.height = "80vh";
        popup.style.overflowY = "auto";
        popup.style.border = "3px solid #7aa7ff";
        popup.style.borderRadius = "12px";
        popup.style.background = "#fff";
        popup.style.boxShadow = "0 4px 16px rgba(0,0,0,0.2)";
        
        const title = document.createElement("h3");
        title.textContent = "📖 全文和訳";
        title.style.marginTop = "0";
        title.style.marginBottom = "15px";
        title.style.borderBottom = "2px dashed #ddd";
        title.style.paddingBottom = "10px";
        popup.appendChild(title);

        SENTENCES.forEach((sen, index) => {
            const senDiv = document.createElement("div");
            senDiv.style.marginBottom = "15px";
            senDiv.style.padding = "10px";
            senDiv.style.borderLeft = "4px solid #f0f0f0";
            
            const eng = document.createElement("p");
            eng.style.margin = "0 0 5px 0";
            eng.style.fontSize = "0.9rem";
            eng.style.color = "#555";
            eng.innerHTML = `<strong>(${index + 1})</strong> ${sen}`;
            senDiv.appendChild(eng);

            const jp = document.createElement("p");
            jp.style.margin = "0";
            jp.style.fontSize = "1.0rem";
            jp.style.fontWeight = "bold";
            jp.innerHTML = JP_TRANSLATIONS[index] || "（和訳未登録）";
            senDiv.appendChild(jp);
            
            popup.appendChild(senDiv);
        });
        
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "閉じる (Esc)";
        closeBtn.style.position = "sticky";
        closeBtn.style.bottom = "0";
        closeBtn.style.display = "block";
        closeBtn.style.width = "100%";
        closeBtn.style.marginTop = "20px";
        closeBtn.style.padding = "10px";
        closeBtn.style.background = "#7aa7ff";
        closeBtn.style.color = "#fff";
        closeBtn.style.border = "none";
        closeBtn.style.borderRadius = "6px";
        closeBtn.style.cursor = "pointer";
        closeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            clearPopup(fullTransPopup);
            fullTransPopup = null;
        });
        popup.appendChild(closeBtn);

        document.body.appendChild(popup);
        fullTransPopup = popup;
    }


    function setupStudyMode(container) {
        if (!container) return; 

        container.innerHTML = "";

        const settings = document.createElement("div");
        settings.style.border = "1px solid #ddd";
        settings.style.borderRadius = "8px";
        settings.style.padding = "8px 12px";
        settings.style.marginBottom = "12px";
        settings.style.fontSize = "0.85rem";
        settings.style.background = "#faf5ff";

        const title = document.createElement("div");
        title.textContent = "🔊 読み上げ設定・ツール";
        title.style.fontWeight = "bold";
        title.style.marginBottom = "4px";
        settings.appendChild(title);

        const enRow = document.createElement("div");
        enRow.textContent = "英語：";
        const enSlider = document.createElement("input");
        enSlider.type = "range";
        enSlider.min = "0.6";
        enSlider.max = "1.6";
        enSlider.step = "0.1";
        enSlider.value = rateEn.toString();
        enSlider.style.width = "150px";
        enSlider.style.margin = "0 6px";
        const enVal = document.createElement("span");
        enVal.textContent = rateEn.toFixed(1);
        enSlider.addEventListener("input", () => {
            rateEn = parseFloat(enSlider.value);
            enVal.textContent = rateEn.toFixed(1);
        });
        enRow.appendChild(enSlider);
        enRow.appendChild(enVal);
        settings.appendChild(enRow);

        const jaRow = document.createElement("div");
        jaRow.textContent = "日本語（説明）：";
        const jaSlider = document.createElement("input");
        jaSlider.type = "range";
        jaSlider.min = "0.6";
        jaSlider.max = "1.6";
        jaSlider.step = "0.1";
        jaSlider.value = rateJa.toString();
        jaSlider.style.width = "150px";
        jaSlider.style.margin = "0 6px";
        const jaVal = document.createElement("span");
        jaVal.textContent = rateJa.toFixed(1);
        jaSlider.addEventListener("input", () => {
            rateJa = parseFloat(jaSlider.value);
            jaVal.textContent = rateJa.toFixed(1);
        });
        jaRow.appendChild(jaSlider);
        jaRow.appendChild(jaVal);
        settings.appendChild(jaRow);

        const btnRow = document.createElement("div");
        btnRow.style.marginTop = "6px";

        const fullBtn = document.createElement("button");
        fullBtn.textContent = "全文読み上げ";
        fullBtn.style.fontSize = "0.75rem";
        fullBtn.style.borderRadius = "999px";
        fullBtn.style.border = "1px solid #ccc";
        fullBtn.style.background = "#fff";
        fullBtn.style.padding = "2px 8px";
        fullBtn.style.marginRight = "4px";
        fullBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            speakEn(SENTENCES.join(" "));
        });
        
        const transAllBtn = document.createElement("button");
        transAllBtn.textContent = "全文和訳";
        transAllBtn.style.fontSize = "0.75rem";
        transAllBtn.style.borderRadius = "999px";
        transAllBtn.style.border = "1px solid #7aa7ff";
        transAllBtn.style.background = "#eef6ff";
        transAllBtn.style.padding = "2px 8px";
        transAllBtn.style.marginRight = "4px";
        transAllBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            showFullTranslation();
        });


        const stopBtn = document.createElement("button");
        stopBtn.textContent = "読み上げ停止";
        stopBtn.style.fontSize = "0.75rem";
        stopBtn.style.borderRadius = "999px";
        stopBtn.style.border = "1px solid #ccc";
        stopBtn.style.background = "#fff";
        stopBtn.style.padding = "2px 8px";
        stopBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            stopSpeak();
        });

        btnRow.appendChild(fullBtn);
        btnRow.appendChild(transAllBtn);
        btnRow.appendChild(stopBtn);
        settings.appendChild(btnRow);

        container.appendChild(settings);

        // 英文本体
        const paraDiv = document.createElement("div");
        container.appendChild(paraDiv);

        SENTENCES.forEach((sen, index) => {
            const senSpan = document.createElement("span");
            senSpan.className = "g-sentence";

            const tokens = sen.split(/(\s+)/);
            tokens.forEach((token) => {
                const clean = token.replace(/[^a-zA-Z']/g, "");
                if (!clean) {
                    senSpan.appendChild(document.createTextNode(token));
                } else {
                    const lower = clean.toLowerCase();
                    const wSpan = document.createElement("span");
                    wSpan.textContent = token;
                    wSpan.dataset.word = lower;
                    wSpan.style.cursor = "pointer";

                    if (DICT[lower]) {
                        wSpan.style.color = "#0066cc";
                        wSpan.style.fontWeight = "600";
                    }

                    wSpan.addEventListener("click", (e) => {
                        e.stopPropagation();
                        showWordPopup(wSpan, lower);
                    });

                    wSpan.addEventListener("dblclick", (e) => {
                        e.stopPropagation();
                        speakEn(clean);
                    });

                    senSpan.appendChild(wSpan);
                }
            });

            const iconBox = document.createElement("span");
            iconBox.style.marginLeft = "4px";
            iconBox.style.display = "inline-flex"; 

            // 読み上げアイコン (🔊) の設定
            const readIcon = document.createElement("span");
            readIcon.textContent = "🔊";
            readIcon.style.cursor = "pointer";
            readIcon.title = "この文を読む";
            readIcon.style.background = "#fff"; 
            readIcon.style.border = "1px solid #ccc"; 
            readIcon.style.borderRadius = "999px";
            readIcon.style.padding = "0 4px";
            readIcon.style.marginLeft = "2px";
            readIcon.style.fontSize = "0.8rem";
            readIcon.addEventListener("click", (e) => {
                e.stopPropagation();
                speakEn(sen);
            });

            const transBtn = document.createElement("span");
            transBtn.textContent = " 訳";
            transBtn.style.cursor = "pointer";
            transBtn.style.marginLeft = "2px";
            transBtn.style.fontSize = "0.8rem";
            transBtn.style.border = "1px solid #ccc";
            transBtn.style.borderRadius = "999px";
            transBtn.style.padding = "0 4px";
            transBtn.title = "この文の日本語訳";
            transBtn.style.background = "#fff"; 
            transBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                showTransPopup(transBtn, index, sen);
            });

            // 構文ボタン (構) の設定
            const structBtn = document.createElement("span");
            structBtn.textContent = " 構";
            structBtn.style.cursor = "pointer";
            structBtn.style.marginLeft = "2px";
            structBtn.style.fontSize = "0.8rem";
            structBtn.style.border = "1px solid #7aa7ff";
            structBtn.style.borderRadius = "999px";
            structBtn.style.padding = "0 4px";
            structBtn.style.background = "#fff"; 
            structBtn.title = "この文の読解のポイント";
            structBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                showStructPopup(structBtn, index);
            });

            iconBox.appendChild(readIcon);
            iconBox.appendChild(transBtn);
            iconBox.appendChild(structBtn);

            paraDiv.appendChild(senSpan);
            paraDiv.appendChild(iconBox);
            paraDiv.appendChild(document.createTextNode(" "));
        });
    }

    /*****************************************************************
     * 2. ✅ 問題解答・判定モードの関数 
     *****************************************************************/

    function renderPassage() {
        const passageDiv = document.getElementById('passage-text');
        if (passageDiv) {
            passageDiv.innerHTML = QUIZ_PASSAGE.trim().replace(/\n\n/g, '<p>').replace(/\n/g, ' ').replace(/\t/g, '');
            passageDiv.innerHTML = passageDiv.innerHTML.replace(/\((2)\)/g, '<u>(2)</u>').replace(/\((3)\)/g, '<u>(3)</u>');
        }
    }

    function renderQuestions() {
        const container = document.getElementById('questions-container');
        if (!container) return;

        container.innerHTML = '';

        QUESTIONS.forEach((q, index) => {
            const qDiv = document.createElement('div');
            qDiv.className = 'question';
            qDiv.id = q.id;
            
            let html = `<strong>問${index + 1}</strong>: ${q.text}`;

            if (q.type === 'choice' || q.type === 'multiple_choice' || q.type === 'multiple_select') {
                
                // 選択肢のコンテナ (横並びにするためのスタイルを直接適用)
                html += `<div class="answer-input" style="display: flex; flex-wrap: wrap;">`;
                
                q.options.forEach((option, optIndex) => {
                    const optionType = (q.type === 'choice') ? 'radio' : 'checkbox';
                    const optionId = `${q.id}-${String.fromCharCode(97 + optIndex)}`;
                    
                    // 各選択肢を<p>タグで囲み、右マージンで間隔を調整 (横並び対応)
                    html += `<p class="quiz-option-item">`; // 新しいクラス名を使用
                    html += `
                        <input type="${optionType}" id="${optionId}" name="${q.id}" value="${option.split('.')[0]}">
                        <label for="${optionId}">${option}</label>
                    `;
                    html += `</p>`;

                });
                html += '</div>';
            } else if (q.type === 'reorder') {
                html += `<p>並べ替え語句: [${q.words.join(' / ')}]</p>`;
                html += `<div class="answer-input"><input type="text" id="${q.id}-input" placeholder="スペース区切りで入力 (例: what is seen but how it is seen)"></div>`;
            } else if (q.type === 'translation') {
                html += `<p class="source-sentence">（英文: ${q.sentence}）</p>`;
                html += `<div class="answer-input"><input type="text" id="${q.id}-input" placeholder="和訳を入力"></div>`;
            }
            
            html += `<span id="${q.id}-result" class="result"></span>`;
            html += `<button id="${q.id}-exp-btn" class="show-explanation-btn" style="display:none;">解説を見る</button>`;
            html += `<div id="${q.id}-explanation" class="explanation"></div>`;

            qDiv.innerHTML = html;
            container.appendChild(qDiv);
        });
    }
    
    // checkAnswers, toggleFullSolution, renderFullSolution, switchMode は省略

    function toggleFullSolution() {
        const solutionArea = document.getElementById('full-solution-area');
        const button = document.getElementById('show-full-solution-btn');
        if (!solutionArea || !button) return; 

        if (solutionArea.style.display === 'none') {
            solutionArea.style.display = 'block';
            button.textContent = "全問題の解答と解説を閉じる";
            renderFullSolution(solutionArea);
        } else {
            solutionArea.style.display = 'none';
            button.textContent = "全問題の解答と解説を見る";
        }
    }

    function renderFullSolution(area) {
        area.innerHTML = '<h2>全問題の解答と解説</h2>';
        QUESTIONS.forEach((q, index) => {
            let qHtml = `<hr><h3>問${index + 1}</h3>`;
            qHtml += `<p><strong>設問:</strong> ${q.text}</p>`;

            let correctDisplay = Array.isArray(q.correctAnswers) ? q.correctAnswers.join('、') : q.correctAnswer;
            
            qHtml += `<p><strong>正解:</strong> ${correctDisplay}</p>`;
            qHtml += `<p><strong>解説:</strong> ${q.explanation.replace(/\n/g, '<br>')}</p>`;

            area.innerHTML += qHtml;
        });
    }

    function checkAnswers() {
        let allCorrect = true;

        QUESTIONS.forEach(q => {
            const resultSpan = document.getElementById(`${q.id}-result`);
            const expBtn = document.getElementById(`${q.id}-exp-btn`);
            const expDiv = document.getElementById(`${q.id}-explanation`);
            let isCorrect = false;

            if (!resultSpan) return; 

            expDiv.style.display = 'none';
            expBtn.style.display = 'none';

            if (q.type === 'choice') {
                const selectedOption = document.querySelector(`input[name="${q.id}"]:checked`);
                const userAnswer = selectedOption ? selectedOption.value : null;
                isCorrect = (userAnswer === q.correctAnswer);
            } else if (q.type === 'reorder' || q.type === 'translation') {
                const inputElement = document.getElementById(`${q.id}-input`);
                let userAnswer = inputElement ? inputElement.value.trim() : '';
                
                if (q.type === 'reorder') {
                    userAnswer = userAnswer.toLowerCase().replace(/\s+/g, ' ');
                }
                
                isCorrect = (userAnswer === q.correctAnswer);

            } else if (q.type === 'multiple_select' || q.type === 'multiple_choice') {
                const selectedOptions = Array.from(document.querySelectorAll(`input[name="${q.id}"]:checked`)).map(input => input.value);
                const correctAnswers = Array.isArray(q.correctAnswers) ? q.correctAnswers : q.parts.map(p => p.answer);
                
                isCorrect = (selectedOptions.length === correctAnswers.length && 
                             selectedOptions.every(val => correctAnswers.includes(val)) &&
                             correctAnswers.every(val => selectedOptions.includes(val)));
            }


            if (isCorrect) {
                resultSpan.textContent = '〇 正解';
                resultSpan.className = 'result correct';
            } else {
                resultSpan.textContent = '× 不正解';
                resultSpan.className = 'result incorrect';
                expBtn.style.display = 'inline-block';
                allCorrect = false;
            }

            expBtn.onclick = () => {
                expDiv.innerHTML = q.explanation.replace(/\n/g, '<br>');
                expDiv.style.display = 'block';
            };
        });
        
        if (allCorrect) {
             alert("全問正解です！素晴らしい！");
        }
    }


    /*****************************************************************
     * 3. 起動とモード切り替え
     *****************************************************************/

    function switchMode(mode) {
        const studyContainer = document.getElementById('study-mode-container');
        const quizContainer = document.getElementById('quiz-mode-container');
        const studyBtn = document.getElementById('show-study-mode');
        const quizBtn = document.getElementById('show-quiz-mode');

        if (!studyContainer || !quizContainer || !studyBtn || !quizBtn) {
            if (studyContainer) studyContainer.style.display = 'block';
            return;
        }

        clearAllPopups(); 

        if (mode === 'study') {
            studyContainer.style.display = 'block';
            quizContainer.style.display = 'none';
            studyBtn.classList.add('active-mode');
            quizBtn.classList.remove('active-mode');
        } else if (mode === 'quiz') {
            studyContainer.style.display = 'none';
            quizContainer.style.display = 'block';
            studyBtn.classList.remove('active-mode');
            quizBtn.classList.add('active-mode');
        }
    }


    document.addEventListener('DOMContentLoaded', () => {
        // 学習モードの初期化
        const studyBox = document.getElementById("study-mode-container");
        setupStudyMode(studyBox);
        
        // 問題モードの初期化
        renderPassage();
        renderQuestions();
        
        // イベントリスナーの設定
        const checkBtn = document.getElementById('check-answers-btn');
        const solutionBtn = document.getElementById('show-full-solution-btn');
        const studyBtn = document.getElementById('show-study-mode');
        const quizBtn = document.getElementById('show-quiz-mode');
        
        if (checkBtn) checkBtn.addEventListener('click', checkAnswers);
        if (solutionBtn) solutionBtn.addEventListener('click', toggleFullSolution);
        
        // モード切り替えボタンのイベントを設定
        if (studyBtn && quizBtn) {
            studyBtn.addEventListener('click', () => switchMode('study'));
            quizBtn.addEventListener('click', () => switchMode('quiz'));
            switchMode('study');
        } else {
             if (studyBox) studyBox.style.display = 'block';
        }


        // ポップアップを画面のどこかをクリックしたら閉じるイベント
        document.addEventListener("click", function () {
            clearPopup(wordPopup);
            clearPopup(transPopup);
            clearPopup(structPopup);
        });
        
        // ESCキーで全文和訳ポップアップを閉じるイベント
        document.addEventListener("keydown", function(e) {
            if (e.key === "Escape" && fullTransPopup) {
                clearPopup(fullTransPopup);
                fullTransPopup = null;
            }
        });
    });

})();