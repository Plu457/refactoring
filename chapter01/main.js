import { readJSON } from '../fileController.js';
import statement from './statement.js';

const invoices = readJSON('chapter01/invoices.json');
const plays = readJSON('chapter01/plays.json');

invoices.forEach(invoice => {
  console.log(statement(invoice, plays));
});
