async function getArtifactLink(artifactName, github, owner, repo, run_id) {
    // get the list of artifacts
    const artifacts = await github.paginate(
        github.rest.actions.listWorkflowRunArtifacts, { owner, repo, run_id }
    );

    if (!artifacts.length) {
        return core.error(`No artifacts found`);
    }

    for (const artifact of artifacts) {
        if (artifact.name == artifactName) {
            return `https://nightly.link/${owner}/${repo}/actions/artifacts/${artifact.id}.zip`;
        }
    }
    return core.error(`failed to find ${artifactName} artifact`);
}

function escapeMarkdown(text) {
    return text
        .replace(/\\/g, '\\\\') // Escape backslashes
        .replace(/`/g, '\\`')   // Escape backticks
        .replace(/\*/g, '\\*')  // Escape asterisks
        .replace(/_/g, '\\_')   // Escape underscores
        .replace(/{/g, '\\{')   // Escape curly braces
        .replace(/}/g, '\\}')   // Escape curly braces
        .replace(/\[/g, '\\[')  // Escape square brackets
        .replace(/\]/g, '\\]')  // Escape square brackets
        .replace(/\(/g, '\\(')  // Escape parentheses
        .replace(/\)/g, '\\)')  // Escape parentheses
        .replace(/#/g, '\\#')   // Escape hash
        .replace(/\+/g, '\\+')  // Escape plus
        .replace(/-/g, '\\-')   // Escape minus
        .replace(/!/g, '\\!');  // Escape exclamation mark
}

module.exports = async ({ inputs, github, context }) => {
    const ARTIFACT_NAME = inputs["name"];
    const LINK_DESCRIPTION = escapeMarkdown(inputs["description"]);

    const PULL_NUMBER = context.issue.number;
    const RUN_ID = context.runId;
    const { owner, repo } = context.repo;

    let link = "";
    let body_message = "";

    link = await getArtifactLink(ARTIFACT_NAME, github, owner, repo, RUN_ID);
    body_message = `[${LINK_DESCRIPTION}](${link})\n`;

    const HORIZONTAL_LINE = `\r\n\r\n<!-- comment-artifact separator start -->\r\n----\r\n<!-- comment-artifact separator end -->`;

    let body = "";
    if (pull.body) {
        if (pull.body.indexOf(HORIZONTAL_LINE) === -1) {
            // First time updating this description -> adding horizontal line
            body = pull.body + HORIZONTAL_LINE;
        }
    }
    else {
        // Pull Request description is empty
        body = HORIZONTAL_LINE;
    }

    const MESSAGE_SEPARATOR_START = `\r\n\r\n<!-- download-section ${workflow_name} ${ARTIFACT_NAME} start -->\r\n`;
    const MESSAGE_SEPARATOR_END = `\r\n<!-- download-section ${workflow_name} ${ARTIFACT_NAME} end -->`;

    const { data: pull } = await github.rest.pulls.get({
        owner: owner,
        repo: repo,
        pull_number: PULL_NUMBER,
    });

    if (pull.body.indexOf(MESSAGE_SEPARATOR_START) === -1) {
        // First time updating this description
        body = pull.body + MESSAGE_SEPARATOR_START + body_message + MESSAGE_SEPARATOR_END;
    }
    else {
        // we already updated this description before
        body = pull.body.slice(0, pull.body.indexOf(MESSAGE_SEPARATOR_START));
        body = body + MESSAGE_SEPARATOR_START + body_message + MESSAGE_SEPARATOR_END;
        body = body + pull.body.slice(pull.body.indexOf(MESSAGE_SEPARATOR_END) + MESSAGE_SEPARATOR_END.length);
    }

    github.rest.pulls.update({
        owner: owner,
        repo: repo,
        pull_number: PULL_NUMBER,
        body: body,
    });
}
