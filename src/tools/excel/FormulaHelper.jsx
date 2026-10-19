import { useState } from 'react';

const F = [
  ['SUM', '=SUM(B2:B10)', 'Adds all numbers in a range.', 'Total of the values in B2 to B10.'],
  ['AVERAGE', '=AVERAGE(B2:B10)', 'Mean of the numbers in a range.', 'Average marks in a column.'],
  ['COUNT / COUNTA', '=COUNT(B2:B10)  =COUNTA(A2:A10)', 'COUNT counts numbers; COUNTA counts non-empty cells.', 'How many students have a score vs. how many names are filled in.'],
  ['MAX / MIN', '=MAX(B2:B10)  =MIN(B2:B10)', 'Largest and smallest value.', 'Highest and lowest sale.'],
  ['IF', '=IF(B2>=40,"Pass","Fail")', 'Returns one result if a test is true, another if false.', 'Label each score as Pass or Fail.'],
  ['IFERROR', '=IFERROR(A2/B2,"")', 'Shows a fallback instead of an error.', 'Avoid #DIV/0! when B2 is zero.'],
  ['COUNTIF', '=COUNTIF(C2:C50,"Paid")', 'Counts cells that match a condition.', 'Number of invoices marked Paid.'],
  ['SUMIF', '=SUMIF(C2:C50,"Paid",D2:D50)', 'Adds values where another column matches.', 'Total amount of Paid invoices.'],
  ['VLOOKUP', '=VLOOKUP(A2,Sheet2!A:C,3,FALSE)', 'Finds a value in the first column of a table and returns a column from the same row. FALSE means exact match.', 'Look up a product price by its ID.'],
  ['XLOOKUP', '=XLOOKUP(A2,Sheet2!A:A,Sheet2!C:C,"Not found")', 'Newer, simpler lookup that can search any column (Excel 2021 / Microsoft 365).', 'Same price lookup with a custom “not found” message.'],
  ['INDEX + MATCH', '=INDEX(C:C,MATCH(A2,A:A,0))', 'Flexible lookup that works in any Excel version.', 'Find the row of A2 in column A, return the value from column C.'],
  ['CONCAT / TEXTJOIN', '=TEXTJOIN(" ",TRUE,A2,B2)', 'Joins text from several cells with a separator.', 'First name + last name in one cell.'],
  ['LEFT / RIGHT / MID', '=LEFT(A2,3)  =MID(A2,2,4)', 'Takes characters from the start, end or middle of text.', 'First three letters of a code.'],
  ['TRIM', '=TRIM(A2)', 'Removes extra spaces from text.', 'Clean names copied from other sources.'],
  ['UPPER / LOWER / PROPER', '=PROPER(A2)', 'Changes the capitalisation of text.', 'Turn “rAHUL kumar” into “Rahul Kumar”.'],
  ['ROUND', '=ROUND(B2,2)', 'Rounds a number to a number of decimals.', 'Round a price to 2 decimals.'],
  ['TODAY / NOW', '=TODAY()', 'Current date (and time for NOW). Updates every time the file opens.', 'Calculate how many days are left until a deadline.'],
  ['DATEDIF', '=DATEDIF(A2,TODAY(),"Y")', 'Difference between two dates in years (Y), months (M) or days (D).', 'Age from a date of birth.'],
  ['UNIQUE', '=UNIQUE(A2:A100)', 'Lists each different value once (Microsoft 365 / Excel 2021).', 'A clean list of cities.'],
  ['FILTER', '=FILTER(A2:C100,C2:C100>1000)', 'Returns only the rows that match a condition (Microsoft 365 / Excel 2021).', 'All orders above 1000.'],
];

export default function FormulaHelper() {
  const [q, setQ] = useState('');
  const list = F.filter((r) => r.join(' ').toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="img-tool">
      <div className="filter"><label htmlFor="fh">Search formulas</label>
        <input id="fh" type="search" value={q} placeholder="e.g. lookup, count, text" onChange={(e) => setQ(e.target.value)} /></div>
      {list.length === 0 && <p>No formula matches “{q}”.</p>}
      <ul className="img-results">
        {list.map(([name, ex, what, use]) => (
          <li key={name}>
            <h3>{name}</h3>
            <p><code>{ex}</code></p>
            <p>{what}</p>
            <p className="small muted">Example use: {use}</p>
          </li>
        ))}
      </ul>
      <p className="small muted">Some formulas (XLOOKUP, UNIQUE, FILTER) need Excel 2021 or Microsoft 365. Formula separators can be semicolons in some regional settings.</p>
    </div>
  );
}
