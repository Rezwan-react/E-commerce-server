function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function buildSearchQuery(search) {
    if (!search || !search.trim()) return {};

    const words = search.trim().split(/\s+/);
    const regexConditions = words.map((word) => ({
        title: { $regex: new RegExp(escapeRegex(word), "i") },
    }));

    return { $and: regexConditions };
}

module.exports = { buildSearchQuery };