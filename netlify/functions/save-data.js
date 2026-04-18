// Netlify Function: save-data
// 管理画面から送信されたJSONデータをGitHubリポジトリにコミットする
//
// 必要な環境変数（Netlifyの Site configuration > Environment variables で設定）:
//   GITHUB_TOKEN      - GitHubのPersonal Access Token（repo権限）
//   GITHUB_REPO       - リポジトリ名（例: owner/works-ami-site）
//   GITHUB_BRANCH     - ブランチ名（例: main）
//   ADMIN_PASSWORD    - 管理画面のパスワード（平文）

exports.handler = async (event) => {
  // POST のみ許可
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH = 'main' } = process.env;

  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '環境変数 GITHUB_TOKEN / GITHUB_REPO が設定されていません' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
    const filePath = 'admin/site-data.json';

    // 既存ファイルのSHAを取得（更新に必要）
    let sha = null;
    try {
      const getRes = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`,
        { headers: { Authorization: `token ${GITHUB_TOKEN}`, 'User-Agent': 'WorksAmi-CMS' } }
      );
      if (getRes.ok) {
        const existing = await getRes.json();
        sha = existing.sha;
      }
    } catch { /* 新規ファイルの場合はSHA不要 */ }

    // ファイルをコミット
    const putBody = {
      message: '管理画面からサイト文面を更新',
      content,
      branch: GITHUB_BRANCH,
    };
    if (sha) putBody.sha = sha;

    const putRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'WorksAmi-CMS'
        },
        body: JSON.stringify(putBody)
      }
    );

    if (putRes.ok) {
      return { statusCode: 200, body: JSON.stringify({ success: true }) };
    } else {
      const err = await putRes.text();
      return { statusCode: 500, body: JSON.stringify({ error: err }) };
    }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
