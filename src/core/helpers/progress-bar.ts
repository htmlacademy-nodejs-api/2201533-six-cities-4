export function progressBar(progress: number, max: number) {
  const width = 10;
  const step = Math.round(max / width);
  console.log(`step: ${step}`);
  const steps = Math.floor(progress / step);
  console.log(`steps: ${steps}`);
  const tail = progress % step;
  console.log(`tail: ${tail}`);
  return progress.toString();
  // return `${[
  //   String.fromCharCode(9608),
  //   String.fromCharCode(9609),
  //   String.fromCharCode(9610),
  //   String.fromCharCode(9611),
  //   String.fromCharCode(9612),
  //   String.fromCharCode(9613),
  //   String.fromCharCode(9614),
  //   String.fromCharCode(9615),
  //   String.fromCharCode(9621),
  //   String.fromCharCode(9620),
  //   String.fromCharCode(9615),
  //   String.fromCharCode(9621),
  //   String.fromCharCode(9601),
  //   String.fromCharCode(9615),
  // ].join('')}`;
}
