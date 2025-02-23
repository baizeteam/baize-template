type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]];

/* 检查是否Any类型 */
type CheckAny<T> = (T extends never ? true : false) extends false ? false : true;

export type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never;
export type Paths<T, D extends number = 3> = [D] extends [never]
  ? never
  : CheckAny<T> extends true
  ? never
  : T extends Array<any>
  ? never
  : T extends Function
  ? never
  : T extends object
  ? {
      [K in keyof T]-?: K extends string | number ? `${K}` | Join<K, Paths<T[K], Prev[D]>> : never;
    }[keyof T]
  : '';

export type PropType<T, Path extends string> = string extends Path
  ? unknown
  : Path extends keyof T
  ? T[Path]
  : Path extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? PropType<T[K], R>
    : unknown
  : unknown;

// 生成递归的key: value。只递归一层
export type DeepType<T> = {
  [K in Paths<T, 1>]: PropType<T, K>;
};
