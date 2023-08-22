import React, { Component } from 'react';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';

export default class Gantt extends Component {

  // instance of gantt.dataProcessor
  dataProcessor = null;

  initZoom() {
    gantt.ext.zoom.init({
      levels: [
        {
          name: 'Hours',
          scale_height: 60,
          min_column_width: 30,
          scales: [
            { unit: 'day', step: 1, format: '%d %M' },
            { unit: 'hour', step: 1, format: '%H' }
          ]
        },
        {
          name: 'Days',
          scale_height: 60,
          min_column_width: 70,
          scales: [
            { unit: 'week', step: 1, format: 'Week #%W' },
            { unit: 'day', step: 1, format: '%d %M' }
          ]
        },
        {
          name: 'Months',
          scale_height: 60,
          min_column_width: 70,
          scales: [
            { unit: "month", step: 1, format: '%F' },
            { unit: 'week', step: 1, format: '#%W' }
          ]
        }
      ]
    });
  }

  setZoom(value) {
    if (!gantt.ext.zoom.getLevels()) {
      this.initZoom();
    }
    gantt.ext.zoom.setLevel(value);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.zoom !== nextProps.zoom;
  }

  componentDidMount() {
    const { tasks } = this.props;

    var weekScaleTemplate = function (date) {
      var dateToStr = gantt.date.date_to_str("%d %M");
      var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
      return dateToStr(date) + " - " + dateToStr(endDate);
    };
  
    var daysStyle = function(date){
      // you can use gantt.isWorkTime(date)
      // when gantt.config.work_time config is enabled
      // In this sample it's not so we just check week days
  
      if(date.getDay() === 0 || date.getDay() === 6){
        return "weekend";
      }
      return "";
    };

    gantt.config.columns = [
      { name: "wbs", label: "WBS", width: 40, template: gantt.getWBSCode },
      { name: "text", label: "Task name", tree: true, width: 170 },
      { name: "start_date", align: "center", width: 120 },
      { name: "duration", align: "center", width: 60 },
      { name: "add", width: 40 }
    ];

    gantt.config.date_format = "%Y-%m-%d %H:%i";
    gantt.config.date_grid = "%Y-%m-%d %H:%i";
    gantt.config.round_dnd_dates = false;

    //配置任务的时间粒度
    gantt.config.duration_unit = "minute";    // "minute", "hour", "day", "week", "month", "year"
    gantt.config.duration_step = 1;

    //时间轴
    gantt.config.scale_height = 150;
    gantt.config.min_column_width = 10;   //sets the minimum width for a column in the timeline area
    gantt.config.scales = [
      {unit: "day", step:1, format: "%D", css:daysStyle },
      {unit: "minute", step:30, format: "%H:%i"}
    ];

    gantt.plugins({ tooltip: true });
    gantt.init(this.ganttContainer);
    gantt.parse(tasks);

    gantt.createDataProcessor({
      url: "/daka/api/daily/dhtmlx/gantt/",
      mode: "REST",
      deleteAfterConfirmation: true
    });

    gantt.attachEvent("onGanttReady", function () {
      var tooltips = gantt.ext.tooltips;
      tooltips.tooltip.setViewport(gantt.$task_data);
    });
  }

  componentWillUnmount() {
    if (this.dataProcessor) {
      this.dataProcessor.destructor();
      this.dataProcessor = null;
    }
  }

  render() {
    const { zoom } = this.props;
    this.setZoom(zoom);
    return (
      <div
        ref={(input) => { this.ganttContainer = input }}
        style={{ width: '100%', height: '100%' }}
      ></div>
    );
  }
}