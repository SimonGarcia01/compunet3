//By commenting, that code wont get executed
// import { name } from './types-basics/types.ts';
import { studentIds } from './object-basics/objects.ts';
import { student1 } from './class-basics/classes.ts';
import './types-basics/styles.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container">
  ${studentIds}
  ${student1}
  ${JSON.stringify(student1)}
  </div>
`
