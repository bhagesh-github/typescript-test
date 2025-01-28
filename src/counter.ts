function getCounter(counter: number) {
  if (counter % 2 == 0) {
    return counter;
  } else {
    return counter + 1;
  }
}
export function setupCounter(element: HTMLButtonElement) {
  let counter = 0;
  const setCounter = (count: number) => {
    counter = count;
    element.innerHTML = `count is ${getCounter(counter)}`;
  };
  element.addEventListener('click', () => setCounter(counter + 1));
  setCounter(0);
}
