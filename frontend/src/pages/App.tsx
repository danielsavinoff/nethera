import { createSignal } from "solid-js";
import { Button } from "~/components/ui/Button";

function App() {
  const [count, setCount] = createSignal(0);

  return (
    <>
      <Button
        variant="outline"
        class="m-10"
        onClick={() => setCount((count) => count + 1)}
      >
        Count is {count()}
      </Button>
    </>
  );
}

export default App;
