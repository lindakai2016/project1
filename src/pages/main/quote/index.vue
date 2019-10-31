<template>
    <div class="quote">
        <div class="quoteContent">
            <div class="iL">
                <label class="lb">更新时间：</label>
                <span class="val">2019-09-08 12:04:06</span>
            </div>
            <div class="ck-content" v-html="content"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: "quote",
    components: {
        
    },
    data() {
        return {
            content: "",
        }
    },
    watch: {
       
    },
    mounted() {
        this.getQuote();

    },
    methods: {
        getQuote() {
            this.content = `<h2>Taj Mahal: A breathtaking ode to love</h2><figure class="image image-style-side"><img src="../../assets/img/tajmahal.jpg" alt="Taj Mahal illustration."><figcaption>Taj Mahal with its poetic white marble tomb</figcaption></figure><p>No trip to India is complete without visiting this spectacular monument, <a href="https://en.wikipedia.org/wiki/New7Wonders_of_the_World"><strong>counted among the Seven Wonders of the World</strong></a>.</p><p>Tourists frequently admit that Taj Mahal "simply cannot be described with words". And that’s probably true. The more you try the more speechless you become. Words give only a semblance of truth. The real truth about its beauty is revealed when you adore <strong>different shades of “Taj” depending on the time of the day</strong> or when you admire the exquisite inlay work in different corners of the façade.</p><h3>Masterpiece of the world’s heritage</h3><p>Taj Mahal is a mausoleum built in Agra between 1631 and 1648 by Emperor Shah Jahan <strong>in the memory of his beloved wife</strong>, Mumtaz Mahal, whose body lies there. It took 20 000 workers to complete and the excellence of this building is visible in every brick.</p><p>In 1983, Taj Mahal was appointed <a href="https://en.wikipedia.org/wiki/World_Heritage_Site">UNESCO World Heritage Site</a> for being "the jewel of Muslim art in India and one of the universally admired masterpieces of the world's heritage".</p><p>If you like having a methodology for visiting historical places, here are the four elements on which we recommend to focus your attention:</p><ul><li>The tomb</li><li>The Decorations</li><li>The Garden</li><li>The Outlying buildings</li></ul><p>The tomb is what immediately catches your eyesight. The <strong>white and soft marble</strong> embroidered with stones leaves you totally enchanted.</p>`;
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
        .iL {
            text-align: center;
            font-size: 12px;
            color: rgba(44, 54, 66, 0.5);
            .lb {
                color: rgba(44, 54, 66, 0.5);
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
