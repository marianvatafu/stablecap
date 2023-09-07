module.exports = async function (req) {
    if (req.method === 'POST' && !req.data.ID) {
      const tx = cds.transaction(req);
      const [lastEntry] = await tx.run(SELECT.one.from('Foods').orderBy({ ID: 'desc' }));
      const lastID = lastEntry ? lastEntry.ID : 0;
      req.data.ID = lastID + 1;
    }
    return req;
  };
  