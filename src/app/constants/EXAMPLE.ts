import { CommonParams, defaultSide, LocusSide } from "../page";

export const EXAMPLES: Record<
  string,
  () => { left: LocusSide; right: LocusSide; common?: Partial<CommonParams> }
> = {
  Clover: () => {
    return {
      left: defaultSide(70, 70, 1, -3, 0, 0),
      right: defaultSide(70, 70, 1, -3, Math.PI, Math.PI),
    };
  },
  "Negative Clover": () => {
    return {
      left: defaultSide(70, 70, 3, -1, 0, 0),
      right: defaultSide(70, 70, 3, -1, Math.PI, Math.PI),
    };
  },
  Pentagram: () => {
    return {
      left: defaultSide(70, 70, 1, -4, (Math.PI / 2) * 3, (Math.PI / 2) * 3),
      right: defaultSide(
        70,
        70,
        1,
        -4,
        (Math.PI / 180) * 126,
        (Math.PI / 180) * 126
      ),
    };
  },
  "Clear Pentagram": () => {
    return {
      left: defaultSide(70, 70, 2, -3, (Math.PI / 2) * 3, (Math.PI / 2) * 3),
      right: defaultSide(
        70,
        70,
        2,
        -3,
        (Math.PI / 180) * 126,
        (Math.PI / 180) * 126
      ),
    };
  },
  Hexagram: () => {
    return {
      left: defaultSide(70, 70, 1, -5, Math.PI / 2, Math.PI / 2),
      right: defaultSide(70, 70, 1, -5, (Math.PI / 2) * 3, (Math.PI / 2) * 3),
    };
  },
  "Clear Hexagram": () => {
    return {
      left: defaultSide(70, 70, 1, -2, Math.PI / 2, Math.PI / 2),
      right: defaultSide(70, 70, 1, -2, (Math.PI / 2) * 3, (Math.PI / 2) * 3),
    };
  },
  "Cat Eye": () => {
    return {
      left: defaultSide(50, 100, 1, -1, Math.PI / 2, Math.PI / 2),
      right: defaultSide(50, 100, 1, -1, (Math.PI / 2) * 3, (Math.PI / 2) * 3),
    };
  },
  "Linear Cat Eye": () => {
    return {
      left: defaultSide(70, 70, 1, -1, Math.PI / 2, Math.PI / 2),
      right: defaultSide(70, 70, 1, -1, (Math.PI / 2) * 3, (Math.PI / 2) * 3),
    };
  },
  Isolation: () => {
    return {
      left: defaultSide(70, 140, 1, 1, 0, Math.PI),
      right: defaultSide(70, 140, 1, 1, Math.PI, 2 * Math.PI),
    };
  },
};
