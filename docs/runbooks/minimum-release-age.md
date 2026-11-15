# 公開直後のバージョンを入れる

このリポジトリは、公開から 7 日経っていないバージョンをインストールしない設定になっている。
7 日を待たずに入れる必要があるときの手順。

## 何が設定されているか

| 場所 | 設定 | 意味 |
| --- | --- | --- |
| `pnpm-workspace.yaml` | `minimumReleaseAge: 10080` | 公開から 10080 分（7 日）未満の版は解決しない |
| `renovate.json5` | `minimumReleaseAge: "7 days"` | 公開から 7 日経つまで PR を作らない |

悪意あるリリースの大半は公開から短時間で発見・削除されるため、掴まないように待つ。
2 つの値は必ず同じ長さに揃える。Renovate 側が短いと、pnpm がインストールを拒む版の PR が立つ。

## 7 日を待たずに入れる

Renovate の**セキュリティ更新は `minimumReleaseAge` を無視して即座に PR を出す**。
その版が公開 7 日未満だと pnpm 側が解決を拒み、`ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION` で失敗する。

止まるのは `pnpm install` だけではない。pnpm はスクリプト実行前に依存を検証するため、
**`pnpm lint` などのスクリプトも同じエラーで落ちる**（`pre-push` フックも通らなくなる）。

`pnpm-workspace.yaml` の `minimumReleaseAgeExclude` に、入れたいバージョンを明示する。

```yaml
minimumReleaseAgeExclude:
  - 'better-auth@1.6.24'
```

バージョンを省いてパッケージ名だけ書くと、そのパッケージは以後すべての版が待機なしで入る。
**例外はバージョンまで指定し、7 日経ったらこのリストから消す。**

書式は他の設定と同じくパターンが使える。

| 書き方 | 対象 |
| --- | --- |
| `better-auth@1.6.24` | その版だけ |
| `better-auth@1.6.24 \|\| 1.6.25` | 複数の版 |
| `@cloudflare/*` | そのスコープ配下すべて（版を問わない） |

## ロックファイル側が新しすぎるとき

pnpm は既定（`trustLockfile: false`）で**ロックファイル全体を毎回再検証する**。
新規に解決する依存だけでなく、すでに入っている依存も対象になる。
公開 7 日未満の版がロックファイルに残っていると、それだけで install が止まる。

この場合は例外リストに足すより、**7 日を満たす版まで下げる方がよい。**
下げておけば、7 日経った時点で Renovate が自動で上げ直す。

```bash
pnpm --filter <workspace> add <package>@<7 日を満たす版>
```

`npm view <package> time --json` で各版の公開時刻を確認し、
`now - 7 days` より前に公開された最新の版を選ぶ。

## 待機中の更新を確認する

Renovate は待機中の更新を PR にせず、Dependency Dashboard に "Pending Status Checks" として並べる。
急ぐものはダッシュボードからチェックを入れて PR を出させる。ただし pnpm 側は別途上の手順が要る。
