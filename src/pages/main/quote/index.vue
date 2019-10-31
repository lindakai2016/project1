<template>
    <div class="quote">
        <div class="quoteContent" v-if="quoteItem">
            <div class="hUl">
                <div class="iL">
                    <label class="lb">更新人：</label>
                    <span class="val">{{quoteItem.updateBy || "蒋承君"}}</span>
                </div>
                <div class="iL">
                    <label class="lb">更新时间：</label>
                    <span class="val">{{quoteItem.updateTime || "--"}}</span>
                </div>
            </div>
            <div class="ck-content" v-html="quoteItem.content"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: "quote",
    data() {
        return {
            quoteItem: null,
        }
    },
    mounted() {
        this.getQuote();
    },
    methods: {
        getQuote() {
            this.$api["offerDetail"]({}).then(res => {
                if(res.code != 100200) {
                    this.$message.warning(res.message || "请求失败");
                    return;
                }
                this.quoteItem = res.data || {};
            }).catch(err => err);
        }
    }
}
</script>

<style lang="scss">
.quote {
    .quoteContent {
        background: #fff;
        box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.04);
        border-radius: 4px;
        padding: 25px;
        margin-top: 25px;
        .hUl {
            display: flex;
            justify-content: center;
            .iL {
                margin: 0 10px;
                font-size: 12px;
                color: rgba(44, 54, 66, 0.5);
                .lb {
                    color: rgba(44, 54, 66, 0.5);
                }
            }
        }
    }
    .ck-content {
        h1 {
            font-size: 2em;
            margin: 0.67em 0;
        }
        h2 {
            font-size: 1.5em;
            margin: 0.83em 0;
        }
        h3 {
            font-size: 1.17em;
            margin: 1em 0;
        }
        h4 {
            margin: 1.33em 0;
        }
        h5 {
            font-size: 0.83em;
            margin: 1.67em 0;
        }
        h5 {
            font-size: 0.67em;
            margin: 2.33em 0;
        }
        h1, h2, h3, h4, h5, h6, strong  {
            font-weight: bold;
        }
        i {
            font-style: italic;
        }
        p, blockquote {
            margin: 1em 0;
        }
        ul {  
            list-style-type: disc;
            margin: 1em 0;
            padding-left: 40px;
            ul {
                list-style-type: circle;
                ul {
                    list-style-type: square;
                } 
            }
        }
        li {
            list-style: inherit;
            display: list-item;
        }
        ol {
            list-style-type: decimal;
            margin: 1em 0;
            padding-left: 40px;
        }
        td {
            border: 1px solid transparent;
        }
    }
}
</style>
