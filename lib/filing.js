const dsv = require('d3-dsv'),
    fs = require('fs'),
    path = require('path'),
    clone = require('lodash.clonedeep');


/**
 * Appends data to an existing CSV file, adding new columns if needed
 * @param {string} filePath - Path to the existing CSV file
 * @param {Array<Object>} newData - Array of objects to append
 * @returns {Promise<void>}
 */
async function appendToCSV(filePath, newData) {
  // Check if file exists
  let existingData = [];
  let allColumns = new Set();

  try {
    if (fs.existsSync(filePath)) {
      const csvContent = fs.readFileSync(filePath, 'utf8');
      existingData = dsv.csvParse(csvContent);

      // Collect existing columns
      if (existingData.length > 0) {
        Object.keys(existingData[0]).forEach(col => allColumns.add(col));
      }
    }

    // Collect columns from new data
    newData.forEach(row => {
      Object.keys(row).forEach(col => allColumns.add(col));
    });

    // Convert Set to Array for d3-dsv
    const columnArray = Array.from(allColumns);

    // Combine existing and new data
    const combinedData = [...existingData, ...newData];

    // Format as CSV with all columns
    const output = dsv.csvFormat(combinedData, columnArray);

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write to file
    fs.writeFileSync(filePath, output);
  } catch (error) {
    console.error(`Error appending to CSV: ${error.message}`);
    throw error;
  }
}


class Filing {
    constructor(file) {
        this.file = null;
        this.tables = [];
        this.count = 0;
    }


    // does save belong in Filing or somewhere else?
    save(dataPath) {
        let filing = this;

        return new Promise((resolve, reject) => {
            clone(this.tables).forEach(table => {
                const csvFile = `${dataPath + table.name.toLowerCase().replace(/[ ,']+/g, '-')}.csv`;

                table.rows.forEach((row) => {
                    row.file = filing.file;
                });

                appendToCSV(csvFile, table.rows);

                this.count += table.rows.length;
            });

            resolve(filing);
        });
    }
}

module.exports = Filing;
