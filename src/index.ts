// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
type ArgumentTypes<F extends Function> = F extends (...args: infer A) => unknown
  ? A
  : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
type ResponseType<F extends Function> = F extends (...args: any) => infer B
  ? B
  : never;

// eslint-disable-next-line @typescript-eslint/ban-types
export const x = async <FunctionType extends Function>(
  throwable: FunctionType,
  ...args: ArgumentTypes<FunctionType>
) => {
  try {
    const data: Awaited<ResponseType<FunctionType>> = await throwable(...args);
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
