const express = require('express');
const router = express.Router();
const axios = require('axios');

var notebooks;
var notebooksLenovo;
var notebooksAsus;
var notebooksAcer;
var notebooksDell;
var returnRes = {
    "Notebooks": "/notebooks",
    "Lenovo": "/notebooks/lenovo",
    "Asus": "/notebooks/asus",
    "Acer": "/notebooks/acer",
    "Dell": "/notebooks/dell",
};
const htmlAPI = `
<!DOCTYPE html>
<html>
<head>
  <title>API</title>
</head>
<body>
  <ul>
  <li><a href="${returnRes["Notebooks"]}">${"Notebooks"}</a></li>
  <li><a href="${returnRes["Lenovo"]}">${"Notebooks Lenovo"}</a></li>
  <li><a href="${returnRes["Asus"]}">${"Notebooks Asus"}</a></li>
  <li><a href="${returnRes["Acer"]}">${"Notebooks Acer"}</a></li>
  <li><a href="${returnRes["Dell"]}">${"Notebooks Dell"}</a></li>
  </ul>
</body>
</html>
`;
router.get("/", (req, res) => {
    console.log("GET TEST > OK ");
    res.send(htmlAPI);
});

function fetchProducts(dom, products) {
    var result = [];
    dom.window.document.querySelectorAll("div").forEach(value => {
        if (value.className.includes("product")) {
            var itens = value.childNodes;
            var product = {
                "id": products.length,
                "title": "",
                "brand": "",
                "price": "",
                "description": "",
                "img": "",
                "base": baseURI
            }
            products.push(product);
            result.push(product);
            for (let i = 0; i < itens.length; i++) {
                try {
                    if (itens[i].className.includes("img")) {
                        product["img"] = itens[i].getAttribute("src");
                    }
                } catch {}

                if (itens[i].childNodes.length > 0) {
                    fetchDescriptions(itens[i].childNodes, product);
                }
            }
        }
    });

    return result;
}

function fetchDescriptions(itens, product) {
    for (let i = 0; i < itens.length; i++) {

        if (itens[i].childNodes.length > 0) {
            fetchDescriptions(itens[i].childNodes, product)
        }
        try {
            if (itens[i].className.includes("price")) {
                product["price"] = itens[i].textContent;
            } else if (itens[i].className.includes("title")) {
                product["title"] = itens[i].textContent;
                product["brand"] = product["title"].split(" ")[0];
            } else if (itens[i].className.includes("description")) {
                product["description"] = itens[i].textContent;
            }
        } catch {}
    }
}
async function getEcommerce() {
    var page = 1;
    var results = [];

    while (page > 0) {
        const response = await axios.get(baseURI + '/test-sites/e-commerce/static/computers/laptops?page=' + page);
        const htmlString = response.data;
        const jsdom = require("jsdom");
        const {
            JSDOM
        } = jsdom;
        const dom = new JSDOM(htmlString);
        var result = await fetchProducts(dom, results);
        page++;
        if (result.length == 0) {
            page = -1
        }
    }

    notebooks = results;
    notebooks = await notebooks.sort((a, b) => {
        return parseFloat(a.price.replace("$", "")) - parseFloat(b.price.replace("$", ""));
    });
    notebooksLenovo = await notebooks.filter(notebook => notebook.brand === 'Lenovo');
    notebooksAsus = await notebooks.filter(notebook => notebook.brand === 'Asus');
    notebooksAcer = await notebooks.filter(notebook => notebook.brand === 'Acer');
    notebooksDell = await notebooks.filter(notebook => notebook.brand === 'Dell');
}
const baseURI = "https://webscraper.io"
var refresh = true;

router.get('/notebooks', async (req, res) => {
    try {
        if (refresh) {
            await getEcommerce();
            refresh = false;
        }
        res.json(notebooks);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Erro ao buscar notebooks'
        });
    }
});
router.get('/notebooks/lenovo', async (req, res) => {
    try {
        if (refresh) {
            await getEcommerce();
            refresh = false;
        }
        res.json(notebooksLenovo);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Erro ao buscar notebooks Lenovo'
        });
    }
});
router.get('/notebooks/asus', async (req, res) => {
    try {
        if (refresh) {
            await getEcommerce();
            refresh = false;
        }
        res.json(notebooksAsus);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Erro ao buscar notebooks Asus'
        });
    }
});
router.get('/notebooks/acer', async (req, res) => {
    try {
        if (refresh) {
            await getEcommerce();
            refresh = false;
        }
        res.json(notebooksAcer);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Erro ao buscar notebooks Acer'
        });
    }
});
router.get('/notebooks/dell', async (req, res) => {
    try {
        if (refresh) {
            await getEcommerce();
            refresh = false;
        }
        res.json(notebooksDell);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Erro ao buscar notebooks Dell'
        });
    }
});

module.exports = router;