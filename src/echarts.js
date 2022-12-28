import React from 'react';
import ReactECharts from 'echarts-for-react';

function BarChart({ title, data }) {

    let source_array = []

    Object.keys(data.data).map( k=>{
        // console.log( data.data[k] )
        const t = data.data[k];
        source_array.push({ ...t,product: k, })
    } )

    console.log( source_array )

    return <ReactECharts option={{
        title: {
            text: title
        },
        legend: {},
        tooltip: {},
        dataset: {
            dimensions: ['product', '2020', '2021', '2022'],
            source: source_array
        },
        xAxis: { type: 'category' },
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
    }} style={{ width: "100%", height: "300px" }} ></ReactECharts>
}


//折线堆叠
function StackedAreaChart({ title, data }) {
    const xAxis_data = Object.keys(data.data)   //x轴 ，为yaml的第一层key

    let merage_array = [];

    try {
        xAxis_data.map(xasis_key => {
            const item = data.data[xasis_key]   //item是一个包括多个kv 的object

            Object.keys(item).map(lengend_key => {

                let target = merage_array.find((i) => { return Object.keys(i)[0] === lengend_key })

                if (target === undefined) {
                    merage_array.push({
                        [lengend_key]: {
                            name: lengend_key,
                            type: 'line',
                            stack: 'Total',
                            areaStyle: {},
                            emphasis: {
                                focus: 'series'
                            },
                            data: [item[lengend_key]]
                        }
                    })
                }
                else {
                    target[lengend_key].data.push(item[lengend_key])
                }
                return true;
            })

            return true;
        })
    }
    catch (e) {
        return;
    }

    let series_array = [];
    let lengend_array = [];

    merage_array.map(item => {
        lengend_array.push(Object.keys(item)[0])
        series_array.push(item[Object.keys(item)[0]])
        return;
    })

    return <ReactECharts option={{
        title: {
            text: title
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: lengend_array
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: xAxis_data
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: series_array
    }} style={{ width: "100%", height: "300px" }} ></ReactECharts>
}

function Pie({ title, data }) {

    let array = []

    Object.keys(data.item).map(key => {
        array.push({ value: data.item[key], name: key, })
        return;
    })

    return (
        <ReactECharts
            option={{
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '5%',
                    left: 'center'
                },
                series: [
                    {
                        name: title,
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '40',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: array
                    }
                ]
            }}
            style={{ width: "600px", height: "300px" }}
        ></ReactECharts>
    )
}

export {
    Pie,
    StackedAreaChart,
    BarChart
};

