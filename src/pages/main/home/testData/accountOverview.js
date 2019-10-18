export default{
    "code": "100200",
    "message": "SUCCESS！",
    "data": {
        "accountView":1,     //是否显示，1显示;0不显示
        "accountOverview":{  //账号概览
            "orderNum":120,
            "orderPrice":1325,
            "userNum":0
        },
        "orderView": 1,     //是否显示，1显示;0不显示
        "orderOverview":[  //订单量及消防金额
            {
                "date":"8月26",
                "orderNum": 11,
                "orderPrice": 332
            },
            {
                "date":"8月27",
                "orderNum": 33,
                "orderPrice": 33
            },
            {
                "date":"8月28",
                "orderNum": 34,
                "orderPrice": 22
            },
            {
                "date":"8月29",
                "orderNum": 34,
                "orderPrice": 22
            },
        ],
        "userView": 1,     //是否显示，1显示;0不显示
        "userOverview":[  //员工用车及消费情况
            {
                "name":"张三",
                "orderNum":12,
                "orderRate":0.5,
                "orderPrice":120,
                "orderPriceRate":0.12
            },
            {
                "name":"张三",
                "orderNum":1,
                "orderRate":0.2,
                "orderPrice":120,
                "orderPriceRate":0.12
            },
            {
                "name":"张三",
                "orderNum":1,
                "orderRate":0.2,
                "orderPrice":120,
                "orderPriceRate":0.12
            },
            {
                "name":"张三",
                "orderNum":1,
                "orderRate":0.2,
                "orderPrice":120,
                "orderPriceRate":0.42
            },
        ],
        "orderTypeView":1,  //是否显示，1显示;0不显示
        "orderTypeOverview":{ //订单类型分布
            "total":120,
            "list":[
                {
                    "name":"接机",
                    "rate":0.2
                },
                {
                    "name":"送机",
                    "rate":0.2
                },
                {
                    "name":"接站",
                    "rate":0.6
                },
                {
                    "name":"送站",
                    "rate":0.8
                },
                {
                    "name":"市内用车",
                    "rate":0.2
                },
                {
                    "name":"包车",
                    "rate":0.5
                },
            ]
        }
        ,
        "orderPriceView":1, //是否显示，1显示;0不显示
        "orderPriceOverview":{ //订单费用分布
            "total":1200,
            "list":[
                {
                    "name":"接机",
                    "rate":0.2
                },
                {
                    "name":"送机",
                    "rate":0.2
                },
                {
                    "name":"接站",
                    "rate":0.6
                },
                {
                    "name":"送站",
                    "rate":0.8
                },
                {
                    "name":"市内用车",
                    "rate":0.2
                },
                {
                    "name":"包车",
                    "rate":0.5
                },
            ]
        },
        "settleView":1,    //是否显示，1显示;0不显示
        "settleOverview":{ //结算情况
            "total":1200,
            "list":[
                {
                    "name":"接机",
                    "rate":0.2
                },
                {
                    "name":"送机",
                    "rate":0.2
                },
                {
                    "name":"接站",
                    "rate":0.6
                },
                {
                    "name":"送站",
                    "rate":0.8
                },
                {
                    "name":"市内用车",
                    "rate":0.2
                },
                {
                    "name":"包车",
                    "rate":0.5
                },
            ]
        }
    }
  }