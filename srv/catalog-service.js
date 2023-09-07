const cds = require('@sap/cds');
const debug = require('debug')('srv:catalog-service');

const preRequestScript = require('./preRequestScript');

module.exports = cds.service.impl(async function () {
  // ...

  this.on('*', '*', async (req) => {
    return await preRequestScript(req);
  });

  // ......
});

  
module.exports = cds.service.impl(async function () {

    const {
            Sales
          } = this.entities;

    this.after('READ', Sales, (each) => {
        if (each.amount > 500) {
            each.criticality = 3;
            if (each.comments === null)
                each.comments = '';
            else
                each.comments += ' ';
            each.comments += 'Exceptional!';
            debug(each.comments, {"country": each.country, "amount": each.amount});
        } else if (each.amount < 150) {
            each.criticality = 1;
        } else {
            each.criticality = 2;
        }
    });

    this.on('boost', Sales, async req => {
        try {
            const ID = req.params[0];
            const tx = cds.tx(req);
            await tx.update(Sales)
                .with({ amount: { '+=': 250 }, comments: 'Boosted!' })
                .where({ ID: { '=': ID } })
                ;
            debug('Boosted ID:', ID);
            const cs = await cds.connect.to('CatalogService');
            let results = await cs.read(SELECT.from(Sales, ID));
            return results;
        } catch (err) {
            req.reject(err);
        }
    });


    this.on('topSales', async (req) => {
        try {
            const tx = cds.tx(req);
            const results = await tx.run(`CALL "APPTEMPLATE_DB_SP_TopSales"(?,?)`, [req.data.amount]);
            return results.RESULT;
        } catch (err) {
            req.reject(err);
        }
    });
    const { Foods } = this.entities;

    this.on('deleteAllFoods', async (req) => {
      try {
        const tx = cds.transaction(req);
        const cs = await cds.connect.to('CatalogService');
        await cs.run(DELETE.from('Foods'));
        return 'All entities deleted successfully.';
      } catch (error) {
        console.error('Error deleting entries:', error);
        throw error;
      }
    });

    this.on('msgFridge', async (req) => {
        try {
            const id = req.data.param1;
            const tx = cds.transaction(req);
            const cs = await cds.connect.to('CatalogService');
            const foods = await cs.run(SELECT.from('Foods', ['Name', 'Quantity', 'UOM']))
            const items = foods.map(food => `${food.Quantity} ${food.UOM} of ${food.Name}`);
            const result = items.join(', ');
            const message = `I have in my fridge ${result}. I want you to suggest me a ${id} that I can make with these ingredients. I need you to reply ONLY WITH a JSON-format message with 4 nodes: MealPossible with values yes/no if there is any meal that you can suggest, SuggestedMeal where you put the suggested meal name and Quantities node that contains an array with necessary quantities(meal for one) in kg and the ingredient name. Forth node will be Steps which contains all the steps required to make the dish. If the MealPossible node value is no, do not send the other nodes.`;
            const { Configuration, OpenAIApi } = require("openai");

            const configuration = new Configuration({
            apiKey: "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",
            organization: "org-6EZTYqHtqgHR09Kukym4FaCS"
            });
            const openai = new OpenAIApi(configuration);

            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                max_tokens: 1000,
                temperature: 0.3,
                messages: [{role: "user", content: message}]
              });
              return completion.data.choices[0].message;
        }
            catch (error) {
                console.error('Error fetching entries:', error);
                throw error;
              }
      });

      this.on('anothermsgFridge', async (req) => {
        try {
            const id = req.data.param1;
            const idd = req.data.param2;
            const tx = cds.transaction(req);
            const cs = await cds.connect.to('CatalogService');
            const foods = await cs.run(SELECT.from('Foods', ['Name', 'Quantity', 'UOM']))
            const items = foods.map(food => `${food.Quantity} ${food.UOM} of ${food.Name}`);
            const result = items.join(', ');
            const message = `I have in my fridge ${result}. I want you to suggest me a different ${idd} meal than ${id} that I can make with these ingredients. I need you to reply ONLY WITH a JSON-format message with 4 nodes: MealPossible with values yes/no if there is any meal that you can suggest, SuggestedMeal where you put the suggested meal name and Quantities node that contains an array with necessary quantities(meal for one) in kg and the ingredient name. Forth node will be Steps which contains all the steps required to make the dish. If the MealPossible node value is no, do not send the other nodes.`;

            const { Configuration, OpenAIApi } = require("openai");

            const configuration = new Configuration({
            apiKey: "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",
            organization: "org-6EZTYqHtqgHR09Kukym4FaCS"
            });
            const openai = new OpenAIApi(configuration);

            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                max_tokens: 1000,
                temperature: 0.3,
                messages: [{role: "user", content: message}]
              });
              return completion.data.choices[0].message;
        }
            catch (error) {
                console.error('Error fetching entries:', error);
                throw error;
              }
      });

});
