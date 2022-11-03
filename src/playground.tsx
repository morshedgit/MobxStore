const CompA = (props: { title: string }) => <h1>{props.title}</h1>;
const CompB = (props: { stars: number }) => <section>{props.stars}</section>;
const CompC = () => null;

const components = {
  A: CompA,
  B: CompB,
  C: CompC,
};
type InferProps<T> = T extends (p: infer P) => unknown ? P : never;
type ComponentKeys = keyof typeof components;
type ComponentsType<T extends ComponentKeys> = typeof components[T];

// const MyComp :ComponentsType<"A">
const Manager = <T extends keyof typeof components>(
  props: InferProps<typeof components[T]> & { compName: T }
) => {
  //   const selectedComponent: ComponentsType<T> = components["A"];
  return (
    <main>
      <h1>Manager</h1>
      {/* <selectedComponent {...props} /> */}
    </main>
  );
};

export {};

const item = {
  a: "one",
  b: 2,
};

type X<K extends keyof typeof item> = typeof item[K];
