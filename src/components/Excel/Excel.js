import React, { Component } from 'react';

import Handsontable from 'handsontable';
import { HotTable } from '@handsontable/react';

import "handsontable/dist/handsontable.min.css";

// register Handsontable's modules
// registerAllModules();
 
export default class ExampleComponent extends Component {
    componentDidMount() {       
    }

    render() {
      const data = [
        ["", "Ford", "Volvo", "Toyota", "Honda"],
        ["2016", 10, 11, 12, 13],
        ["2017", 20, 11, 14, 13],
        ["2018", 30, 15, 12, 13]
      ]
    
      return (
        <div id="example" style={{ "width":"100%", "height":"150px" }} >
          <HotTable
            data={data}
            width="100%"
            height="100%"
            // colHeaders={true}
            // rowHeaders={true}
            licenseKey="non-commercial-and-evaluation"
          />
        </div>
      );
    }
}



