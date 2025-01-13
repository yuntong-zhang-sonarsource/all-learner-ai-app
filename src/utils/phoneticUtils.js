import { metaphone } from "metaphone";

export const phoneticMatch = (str1, str2) => {
  const phonetic1 = metaphone(str1);
  const phonetic2 = metaphone(str2);
  const distance = levenshtein(phonetic1, phonetic2);
  const maxLength = Math.max(phonetic1.length, phonetic2.length);
  return ((maxLength - distance) / maxLength) * 100;
};

export const levenshtein = (a, b) => {
  const tmp = [];
  let i,
    j,
    alen = a.length,
    blen = b.length,
    res;

  if (alen === 0) {
    return blen;
  }
  if (blen === 0) {
    return alen;
  }

  for (i = 0; i <= alen; i++) {
    tmp[i] = [i];
  }
  for (j = 0; j <= blen; j++) {
    tmp[0][j] = j;
  }

  for (i = 1; i <= alen; i++) {
    for (j = 1; j <= blen; j++) {
      res = a[i - 1] === b[j - 1] ? 0 : 1;
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1,
        tmp[i][j - 1] + 1,
        tmp[i - 1][j - 1] + res
      );
    }
  }

  return tmp[alen][blen];
};
