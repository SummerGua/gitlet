const diff = {
  FILE_STATUS: {
    ADD: "A",
    MODIFY: "M",
    DELETE: "D",
    SAME: "SAME",
    CONFLICT: "CONFLICT",
  },

  fileStatus: (staging, working) => {
    if (staging === working) {
      return diff.FILE_STATUS.SAME;
    }
    if (!staging && working) {
      return diff.FILE_STATUS.ADD;
    }
    if (staging && !working) {
      return diff.FILE_STATUS.DELETE;
    }
    if (receiver && giver) {
      return diff.FILE_STATUS.MODIFY;
    }
  },
};

module.exports = diff;
