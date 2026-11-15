# design-docs

**機能の追加・仕様の変更・技術の変更を、どう実現するかを検討し、その判断を記録する場所。** 重要な変更はコードを書く前に書き、ユーザーの承認を得てから実装に入る。

## 仕様の正本ではない

design doc が答えるのは「そのとき、何を・なぜ・どう作ると決めたか」。**今その機能がどう振る舞うべきかは [specs/](../specs/README.md)、今どう組まれているかは [architecture/](../architecture/) が答える。**

実装後の design doc は凍結する。ただし**凍結するのは文書であって、対象の機能や実装ではない。** 凍結した design doc に書かれていることは、仕様や構成を変えてはいけない理由にならない。

## なぜ specs と分けるのか

spec は決まったことの一覧で、**決める過程が残らない。** 後から読んだ人（次の自分、他のメンバー、AI エージェント）は「なぜこの形なのか」を再現できず、同じ議論をもう一度やる。

design doc は過程ごと残す。**やらないことと、検討して捨てた案が本文に入る。** これがあると、

- 実装中にスコープが広がりかけたとき、「やらないこと」に書いてあるかで止められる
- 「やっぱりこっちの作りでは」と思ったとき、すでに捨てた案かどうかが「検討した他の案」でわかる
- AI エージェントに実装させるとき、判断の前提ごと渡せる。仕様だけ渡すと、書いていない部分を勝手に埋められる

一方で、design doc だけでは**どれが今も有効な決定なのかがわからない。** 書いた日の要件がそのまま残るので、後から読むと過去の決定を今の仕様だと取り違える。そこで今の姿は spec に、そこに至った過程は design doc に、と分けて持つ。

書くのは実装者。**合意を取るための文書であって、報告書ではない。** 完成した機能の説明を後から書くのは design doc ではない（それは spec の仕事）。

## いつ書くか

| | design doc |
| --- | --- |
| 画面を足す・URL を増やす | 書く |
| データの持ち方を変える（スキーマ変更） | 書く |
| 既存の画面の振る舞いを変える（仕様変更） | 書く |
| ライブラリ・基盤の選定、構成・規約の変更 | 書く |
| 文言修正・スタイル調整・リファクタリング | 書かない |
| バグ修正 | 書かない（原因と直し方は PR に書く） |

**迷ったら書く。** 書き始めて 10 分で書くことがないなら、それは書かなくていい変更だった、という判断でよい。

## 仕様変更と過去の design doc

ユーザーから仕様の変更を求められたら、**その要求を新しい検討の起点にする。**

- 過去の design doc に違うことが書いてあっても、それを理由に変更を断らない。過去の判断は「当時はこう考えた」という材料として読む
- 今の [specs/](../specs/README.md) と [architecture/](../architecture/) との差分を洗い出し、必要な変更と影響範囲をはっきりさせる
- 既存の制約（安全性、技術的な制約、他の機能への影響）と衝突するなら、影響・リスク・変更案を説明して判断を仰ぐ。制約を無視してよいという意味ではない
- 重要な変更なら新しい design doc を書く。過去の design doc は書き換えない

## ファイル名

書き始めた日を prefix にする。

```text
<YYYYMMDD>_<topic>.md
```

例: `20260826_user-invitation.md`

## 書き方

[`_template.md`](_template.md) をコピーして使う。各節は次の役割で置いてある。

| 節 | 何のためにあるか |
| --- | --- |
| 概要 | ここだけ読んで他の人に説明できる状態にする |
| 背景 | なぜ今これが要るのか。書けないものは、まだ作るときではない |
| 対象の仕様 | 変える・足す spec へのリンクと、今の spec からの差分 |
| ゴール | 達成したかを判定できる形にする |
| やらないこと | 実装中のスコープの広がりを止める |
| 設計 | 画面・URL・置き場所・データ・処理の流れ |
| 検討した他の案 | 捨てた案を残す。後から一番効く |
| トレードオフ | 採った案で何を諦めたか、何を引き受けたか |
| 影響範囲 | 壊れうるものを先に挙げる |
| 仕様・構成への反映 | 実装が入ったときに書き換える spec・architecture・runbook |
| 未決事項 | 決まっていないことを隠さない |

**設計の「置き場所」は [architecture/directory-structure.md](../architecture/directory-structure.md) の判断フローで決める。** ここでディレクトリまで決めておくと、実装時に迷わない。

**「対象の仕様」に書くのは、これから変える案。** 実装が入るまで spec 本体は書き換えない。未実装の案を、実装済みの仕様として spec に書かない。

該当しない節は「なし」と書いて中身を消す。**節ごと消さない。** 空でないことより、考えた上で空だとわかることのほうが役に立つ。

## status の進め方

frontmatter の `status` で状態を持つ。

| status | 意味 | 誰が進めるか |
| --- | --- | --- |
| `draft` | 書いている途中。まだ読まなくていい | 書く人 |
| `review` | 読んでほしい。ここで合意を取る | 書く人 |
| `approved` | 承認済み。実装に入ってよい | **ユーザーが明示的に承認したときだけ** |
| `implemented` | 実装が入った。`pr` に実装 PR を書く | 実装した人 |
| `superseded` | 別の design doc が置き換えた。`superseded_by` と冒頭に後継へのリンクを足す | 後継を書いた人 |

`review` から `approved` に進める条件は 2 つある。

1. **「未決事項」が空になっている。** 未決のまま実装に入ると、その判断はコードを書く人の手元で勝手に決まる
2. **ユーザーが明示的に承認している。** 「進めて」「承認します」のように、その design doc の内容に対する承認がはっきりあること

**AI エージェントは design doc を自己承認しない。** 未決事項が空になっても、自分で `status` を `approved` にしない。承認を求めて止まり、承認を得てから `approved` にして実装に入る。別の design doc や別の作業で得た承認は、この design doc の承認にならない。

## 実装が入ったら

1. `status` を `implemented` にし、`pr` に実装 PR を書く
2. **「仕様・構成への反映」に挙げた spec・architecture・runbook を、同じ PR で書き換える。** design doc に書いた要件は spec に、恒常的な規約になったもの（構成、依存の向き、命名）は architecture に、手で叩く手順は runbook に移す
3. 一覧の status を更新する

## 実装後は凍結する

**`implemented` になった design doc は、その時点の判断の記録として凍結する。** 後から実装が変わっても書き換えない。書き換えると「いつ何を決めたか」が消える。

凍結した design doc に入れてよい変更は次だけ。

- `status` と `pr` の更新、`superseded_by` の追記と、冒頭への後継のリンク
- ファイルの移動・改名に伴うリンクの修正
- 「後から変わったこと」を示す注記。本文の判断は書き換えず、日付付きで注記として足す

方針が変わったら、新しい design doc を書く。新しいものが古いものを丸ごと置き換えるなら、古いほうを `superseded` にする。一部だけを変えるなら、古いほうは `implemented` のままにし、新しいほうから古いほうへリンクする。どちらの場合も、今の姿は spec と architecture に反映する。

## 一覧

<!-- 新しいものを上に追記する -->

| design doc | status | 実装 PR | 今の正本 |
| --- | --- | --- | --- |
| [20260906_db-turso-to-cloudflare-d1.md](20260906_db-turso-to-cloudflare-d1.md) — packages/db を Turso から Cloudflare D1 へ移す | `implemented` | [#257](https://github.com/junkisai/web-app-template/pull/257) | [architecture/overview.md](../architecture/overview.md#データベース)、[runbooks/d1-migrations.md](../runbooks/d1-migrations.md) |
| [20260828_admin-app-astryx.md](20260828_admin-app-astryx.md) — 管理画面用の apps/admin を作り、UI を Astryx で組む | `implemented` | [#234](https://github.com/junkisai/web-app-template/pull/234) | [specs/admin-console.md](../specs/admin-console.md)、[specs/users.md](../specs/users.md)、[apps/admin/README.md](../../apps/admin/README.md) |
| [20260826_tailwind-to-stylex.md](20260826_tailwind-to-stylex.md) — Tailwind CSS から StyleX へ移行する | `implemented` | [#227](https://github.com/junkisai/web-app-template/pull/227) | [architecture/overview.md](../architecture/overview.md#スタイリング) |
