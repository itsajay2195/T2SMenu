export const getPolicyLookupResponse = (response, policyId) => {
    let FilteredResponse = response.filter((item) => item.policy_type_id == policyId);
    let Data = FilteredResponse.map((item) => item.description);
    return Data.toString();
};

export const wrapHtmlTag = (content) => {
    return `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="word-break: break-word">${content}</body></html>`;
};
