import { Module } from "../types";

export const databasesModule: Module = {
  id: "databases",
  title: "Databases",
  description: "Work with MongoDB and Mongoose: learn document modeling, schema design, and CRUD operations.",
  lessons: [
    {
      id: "mongodb-basics",
      slug: "mongodb-basics",
      title: "MongoDB Basics",
      content: `## MongoDB Basics

### What is MongoDB?

**MongoDB** is a NoSQL document database that stores data in flexible, JSON-like documents (BSON). Unlike relational databases with fixed schemas, MongoDB lets you store varied data structures.

### Document vs Relational Model

| Feature | SQL (PostgreSQL) | NoSQL (MongoDB) |
|---------|-----------------|-----------------|
| Data unit | Row in a table | Document in a collection |
| Schema | Fixed, predefined | Flexible, dynamic |
| Relationships | JOINs across tables | Embedded documents or references |
| Query language | SQL | MongoDB Query Language (MQL) |
| Scaling | Vertical (bigger server) | Horizontal (more servers) |

### MongoDB Query Language

\`\`\`javascript
// Insert
db.users.insertOne({ name: "Alice", age: 30 });

// Find
db.users.find({ age: { $gte: 25 } });

// Update
db.users.updateOne({ name: "Alice" }, { $set: { age: 31 } });

// Delete
db.users.deleteOne({ name: "Alice" });
\`\`\`

### Your Task

Implement an in-memory document store that supports MongoDB-style query operators like \`$gt\`, \`$lt\`, \`$in\`, \`$and\`, and \`$or\`.`,
      starterCode: `// Implement an in-memory MongoDB-like document store

function createCollection() {
  let documents = [];
  let nextId = 1;

  function insertOne(doc) {
    // TODO: Add _id field, store document, return { insertedId }
  }

  function insertMany(docs) {
    // TODO: Insert multiple documents, return { insertedIds }
  }

  function matchesQuery(doc, query) {
    // TODO: Check if a document matches a MongoDB-style query
    // Support operators:
    //   $gt, $gte, $lt, $lte - comparison
    //   $in - value in array
    //   $ne - not equal
    //   $and - all conditions must match
    //   $or - at least one condition must match
    // Plain values use equality matching
  }

  function find(query = {}) {
    // TODO: Return all documents matching the query
  }

  function findOne(query = {}) {
    // TODO: Return first matching document or null
  }

  function countDocuments(query = {}) {
    // TODO: Return count of matching documents
  }

  return { insertOne, insertMany, find, findOne, countDocuments };
}

// --- Tests ---
const users = createCollection();

// Insert documents
users.insertOne({ name: 'Alice', age: 30, role: 'admin' });
users.insertOne({ name: 'Bob', age: 25, role: 'user' });
users.insertOne({ name: 'Charlie', age: 35, role: 'user' });
users.insertOne({ name: 'Diana', age: 28, role: 'admin' });
users.insertOne({ name: 'Eve', age: 22, role: 'user' });

// Test find all
console.log(users.find().length);                    // Expected: 5

// Test equality query
console.log(users.find({ role: 'admin' }).length);   // Expected: 2

// Test $gt
console.log(users.find({ age: { $gt: 28 } }).length);  // Expected: 2 (Alice 30, Charlie 35)

// Test $gte
console.log(users.find({ age: { $gte: 28 } }).length); // Expected: 3

// Test $lt
console.log(users.find({ age: { $lt: 25 } }).length);  // Expected: 1 (Eve 22)

// Test $in
console.log(users.find({ name: { $in: ['Alice', 'Bob'] } }).length); // Expected: 2

// Test $ne
console.log(users.find({ role: { $ne: 'admin' } }).length); // Expected: 3

// Test $and
const andResult = users.find({ $and: [{ age: { $gte: 25 } }, { role: 'admin' }] });
console.log(andResult.length);   // Expected: 2 (Alice, Diana)

// Test $or
const orResult = users.find({ $or: [{ age: { $lt: 23 } }, { role: 'admin' }] });
console.log(orResult.length);    // Expected: 3 (Alice, Diana, Eve)

// Test findOne
const alice = users.findOne({ name: 'Alice' });
console.log(alice.age);          // Expected: 30

// Test countDocuments
console.log(users.countDocuments({ role: 'user' })); // Expected: 3
`,
      solutionCode: `// Implement an in-memory MongoDB-like document store

function createCollection() {
  let documents = [];
  let nextId = 1;

  function insertOne(doc) {
    const newDoc = { _id: nextId++, ...doc };
    documents.push(newDoc);
    return { insertedId: newDoc._id };
  }

  function insertMany(docs) {
    const insertedIds = docs.map(doc => insertOne(doc).insertedId);
    return { insertedIds };
  }

  function matchesOperator(value, operator) {
    for (const [op, target] of Object.entries(operator)) {
      switch (op) {
        case '$gt':  if (!(value > target)) return false; break;
        case '$gte': if (!(value >= target)) return false; break;
        case '$lt':  if (!(value < target)) return false; break;
        case '$lte': if (!(value <= target)) return false; break;
        case '$ne':  if (value === target) return false; break;
        case '$in':  if (!target.includes(value)) return false; break;
        default: return false;
      }
    }
    return true;
  }

  function matchesQuery(doc, query) {
    for (const [key, condition] of Object.entries(query)) {
      if (key === '$and') {
        if (!condition.every(subQuery => matchesQuery(doc, subQuery))) return false;
        continue;
      }
      if (key === '$or') {
        if (!condition.some(subQuery => matchesQuery(doc, subQuery))) return false;
        continue;
      }

      const value = doc[key];
      if (typeof condition === 'object' && condition !== null && !Array.isArray(condition)) {
        if (!matchesOperator(value, condition)) return false;
      } else {
        if (value !== condition) return false;
      }
    }
    return true;
  }

  function find(query = {}) {
    return documents.filter(doc => matchesQuery(doc, query));
  }

  function findOne(query = {}) {
    return documents.find(doc => matchesQuery(doc, query)) || null;
  }

  function countDocuments(query = {}) {
    return find(query).length;
  }

  return { insertOne, insertMany, find, findOne, countDocuments };
}

// --- Tests ---
const users = createCollection();

// Insert documents
users.insertOne({ name: 'Alice', age: 30, role: 'admin' });
users.insertOne({ name: 'Bob', age: 25, role: 'user' });
users.insertOne({ name: 'Charlie', age: 35, role: 'user' });
users.insertOne({ name: 'Diana', age: 28, role: 'admin' });
users.insertOne({ name: 'Eve', age: 22, role: 'user' });

// Test find all
console.log(users.find().length);                    // Expected: 5

// Test equality query
console.log(users.find({ role: 'admin' }).length);   // Expected: 2

// Test $gt
console.log(users.find({ age: { $gt: 28 } }).length);  // Expected: 2

// Test $gte
console.log(users.find({ age: { $gte: 28 } }).length); // Expected: 3

// Test $lt
console.log(users.find({ age: { $lt: 25 } }).length);  // Expected: 1

// Test $in
console.log(users.find({ name: { $in: ['Alice', 'Bob'] } }).length); // Expected: 2

// Test $ne
console.log(users.find({ role: { $ne: 'admin' } }).length); // Expected: 3

// Test $and
const andResult = users.find({ $and: [{ age: { $gte: 25 } }, { role: 'admin' }] });
console.log(andResult.length);   // Expected: 2

// Test $or
const orResult = users.find({ $or: [{ age: { $lt: 23 } }, { role: 'admin' }] });
console.log(orResult.length);    // Expected: 3

// Test findOne
const alice = users.findOne({ name: 'Alice' });
console.log(alice.age);          // Expected: 30

// Test countDocuments
console.log(users.countDocuments({ role: 'user' })); // Expected: 3
`,
    },
    {
      id: "mongoose-schemas",
      slug: "mongoose-schemas",
      title: "Mongoose Schemas",
      content: `## Mongoose Schema & Validation

### What is Mongoose?

**Mongoose** is an ODM (Object Document Mapper) for MongoDB that provides schema-based validation, type casting, middleware hooks, and query building on top of MongoDB's flexible document model.

### Schema Definition

\`\`\`javascript
const userSchema = new Schema({
  name: { type: 'string', required: true, minLength: 2 },
  email: { type: 'string', required: true, match: /^[^@]+@[^@]+$/ },
  age: { type: 'number', min: 0, max: 150 },
  role: { type: 'string', enum: ['user', 'admin'], default: 'user' }
});
\`\`\`

### Your Task

Implement a schema validation system that supports type checking, required fields, defaults, min/max constraints, enum validation, and custom validators.`,
      starterCode: `// Implement a Mongoose-like Schema validation system

function createSchema(definition) {
  // TODO: Return a schema object with a validate(data) method
  // The validate method should:
  // 1. Check required fields
  // 2. Apply default values for missing optional fields
  // 3. Validate types (string, number, boolean)
  // 4. Check min/max for numbers
  // 5. Check minLength/maxLength for strings
  // 6. Check enum values
  // 7. Run custom validator functions
  // Return { valid: bool, errors: string[], data: processedData }
}

function createModel(name, schema) {
  // TODO: Return a model object with:
  // - create(data): validate and return the document (or throw)
  // - validate(data): return validation result
  // - name: the model name
}

// --- Tests ---
const userSchema = createSchema({
  name: { type: 'string', required: true, minLength: 2, maxLength: 50 },
  email: {
    type: 'string',
    required: true,
    validate: (val) => val.includes('@') || 'Invalid email format'
  },
  age: { type: 'number', required: false, min: 0, max: 150 },
  role: { type: 'string', enum: ['user', 'admin', 'moderator'], default: 'user' },
  active: { type: 'boolean', default: true }
});

const User = createModel('User', userSchema);

// Test 1: Valid user with defaults
const result1 = User.validate({ name: 'Alice', email: 'alice@test.com', age: 30 });
console.log(result1.valid);           // Expected: true
console.log(result1.data.role);       // Expected: 'user' (default)
console.log(result1.data.active);     // Expected: true (default)

// Test 2: Missing required field
const result2 = User.validate({ name: 'Bob' });
console.log(result2.valid);           // Expected: false
console.log(result2.errors.length > 0); // Expected: true (email missing)

// Test 3: Type mismatch
const result3 = User.validate({ name: 'Charlie', email: 'c@t.com', age: 'thirty' });
console.log(result3.valid);           // Expected: false

// Test 4: Enum violation
const result4 = User.validate({ name: 'Diana', email: 'd@t.com', role: 'superadmin' });
console.log(result4.valid);           // Expected: false

// Test 5: Min/max violation
const result5 = User.validate({ name: 'Eve', email: 'e@t.com', age: -5 });
console.log(result5.valid);           // Expected: false

// Test 6: Custom validator
const result6 = User.validate({ name: 'Frank', email: 'invalid-email' });
console.log(result6.valid);           // Expected: false

// Test 7: String length violation
const result7 = User.validate({ name: 'A', email: 'a@t.com' });
console.log(result7.valid);           // Expected: false (name too short)

// Test 8: create() returns processed data
const user = User.create({ name: 'Grace', email: 'grace@test.com' });
console.log(user.name);              // Expected: 'Grace'
console.log(user.role);              // Expected: 'user'
`,
      solutionCode: `// Implement a Mongoose-like Schema validation system

function createSchema(definition) {
  function validate(data) {
    const errors = [];
    const processedData = { ...data };

    for (const [field, rules] of Object.entries(definition)) {
      const value = data[field];

      // Apply defaults
      if (value === undefined || value === null) {
        if (rules.default !== undefined) {
          processedData[field] = rules.default;
          continue;
        }
        if (rules.required) {
          errors.push(field + ' is required');
          continue;
        }
        continue;
      }

      // Type checking
      if (rules.type && typeof value !== rules.type) {
        errors.push(field + ' must be of type ' + rules.type);
        continue;
      }

      // Number constraints
      if (rules.type === 'number') {
        if (rules.min !== undefined && value < rules.min) {
          errors.push(field + ' must be at least ' + rules.min);
        }
        if (rules.max !== undefined && value > rules.max) {
          errors.push(field + ' must be at most ' + rules.max);
        }
      }

      // String constraints
      if (rules.type === 'string') {
        if (rules.minLength !== undefined && value.length < rules.minLength) {
          errors.push(field + ' must be at least ' + rules.minLength + ' characters');
        }
        if (rules.maxLength !== undefined && value.length > rules.maxLength) {
          errors.push(field + ' must be at most ' + rules.maxLength + ' characters');
        }
      }

      // Enum validation
      if (rules.enum && !rules.enum.includes(value)) {
        errors.push(field + ' must be one of: ' + rules.enum.join(', '));
      }

      // Custom validator
      if (rules.validate) {
        const result = rules.validate(value);
        if (result !== true && typeof result === 'string') {
          errors.push(result);
        }
      }
    }

    return { valid: errors.length === 0, errors, data: processedData };
  }

  return { validate };
}

function createModel(name, schema) {
  return {
    name,
    validate(data) {
      return schema.validate(data);
    },
    create(data) {
      const result = schema.validate(data);
      if (!result.valid) {
        throw new Error('Validation failed: ' + result.errors.join(', '));
      }
      return result.data;
    }
  };
}

// --- Tests ---
const userSchema = createSchema({
  name: { type: 'string', required: true, minLength: 2, maxLength: 50 },
  email: {
    type: 'string',
    required: true,
    validate: (val) => val.includes('@') || 'Invalid email format'
  },
  age: { type: 'number', required: false, min: 0, max: 150 },
  role: { type: 'string', enum: ['user', 'admin', 'moderator'], default: 'user' },
  active: { type: 'boolean', default: true }
});

const User = createModel('User', userSchema);

// Test 1: Valid user with defaults
const result1 = User.validate({ name: 'Alice', email: 'alice@test.com', age: 30 });
console.log(result1.valid);           // Expected: true
console.log(result1.data.role);       // Expected: 'user'
console.log(result1.data.active);     // Expected: true

// Test 2: Missing required field
const result2 = User.validate({ name: 'Bob' });
console.log(result2.valid);           // Expected: false
console.log(result2.errors.length > 0); // Expected: true

// Test 3: Type mismatch
const result3 = User.validate({ name: 'Charlie', email: 'c@t.com', age: 'thirty' });
console.log(result3.valid);           // Expected: false

// Test 4: Enum violation
const result4 = User.validate({ name: 'Diana', email: 'd@t.com', role: 'superadmin' });
console.log(result4.valid);           // Expected: false

// Test 5: Min/max violation
const result5 = User.validate({ name: 'Eve', email: 'e@t.com', age: -5 });
console.log(result5.valid);           // Expected: false

// Test 6: Custom validator
const result6 = User.validate({ name: 'Frank', email: 'invalid-email' });
console.log(result6.valid);           // Expected: false

// Test 7: String length violation
const result7 = User.validate({ name: 'A', email: 'a@t.com' });
console.log(result7.valid);           // Expected: false

// Test 8: create() returns processed data
const user = User.create({ name: 'Grace', email: 'grace@test.com' });
console.log(user.name);              // Expected: 'Grace'
console.log(user.role);              // Expected: 'user'
`,
    },
    {
      id: "crud-operations",
      slug: "crud-operations",
      title: "CRUD Operations",
      content: `## Full CRUD Operations

### Problem Statement

Build a complete data access layer with **Create, Read, Update, Delete** operations, including:

1. **Pagination** and **sorting**
2. **Partial updates** (like MongoDB's \`$set\`)
3. **Bulk operations**
4. **Projection** (selecting specific fields)

### CRUD in MongoDB

| Operation | MongoDB Method | HTTP Verb |
|-----------|---------------|-----------|
| Create | \`insertOne()\`, \`insertMany()\` | POST |
| Read | \`find()\`, \`findOne()\` | GET |
| Update | \`updateOne()\`, \`updateMany()\` | PUT / PATCH |
| Delete | \`deleteOne()\`, \`deleteMany()\` | DELETE |

### Your Task

Implement a full-featured collection with pagination, sorting, projection, and update operators.`,
      starterCode: `// Implement full CRUD with pagination, sorting, and projection

function createCRUDCollection() {
  let documents = [];
  let nextId = 1;

  function insertOne(doc) {
    // TODO: Insert with auto _id and createdAt timestamp
  }

  function find(query = {}, options = {}) {
    // TODO: Find documents matching query with options:
    // options.sort: { field: 1 } for ascending, { field: -1 } for descending
    // options.skip: number of documents to skip (pagination)
    // options.limit: max documents to return
    // options.project: { field1: 1, field2: 1 } to include only those fields
  }

  function findById(id) {
    // TODO: Find document by _id
  }

  function updateOne(query, update) {
    // TODO: Update first matching document
    // Support $set operator for partial updates
    // Add updatedAt timestamp
    // Return { matchedCount, modifiedCount }
  }

  function updateMany(query, update) {
    // TODO: Update all matching documents
  }

  function deleteOne(query) {
    // TODO: Delete first matching document
    // Return { deletedCount }
  }

  function deleteMany(query) {
    // TODO: Delete all matching documents
    // Return { deletedCount }
  }

  return {
    insertOne, find, findById,
    updateOne, updateMany,
    deleteOne, deleteMany,
    get count() { return documents.length; }
  };
}

// --- Tests ---
const products = createCRUDCollection();

// Insert test data
products.insertOne({ name: 'Laptop', price: 999, category: 'electronics' });
products.insertOne({ name: 'Phone', price: 699, category: 'electronics' });
products.insertOne({ name: 'Desk', price: 299, category: 'furniture' });
products.insertOne({ name: 'Chair', price: 199, category: 'furniture' });
products.insertOne({ name: 'Tablet', price: 499, category: 'electronics' });

// Test find all
console.log(products.find().length);  // Expected: 5

// Test find with query
console.log(products.find({ category: 'electronics' }).length); // Expected: 3

// Test sorting (ascending by price)
const sorted = products.find({}, { sort: { price: 1 } });
console.log(sorted[0].name);          // Expected: 'Chair' (199)
console.log(sorted[4].name);          // Expected: 'Laptop' (999)

// Test pagination
const page = products.find({}, { sort: { price: 1 }, skip: 1, limit: 2 });
console.log(page.length);             // Expected: 2
console.log(page[0].name);            // Expected: 'Desk' (299)

// Test projection
const projected = products.find({}, { project: { name: 1, price: 1 } });
console.log('category' in projected[0]); // Expected: false

// Test updateOne with $set
products.updateOne({ name: 'Laptop' }, { $set: { price: 899, onSale: true } });
const laptop = products.find({ name: 'Laptop' })[0];
console.log(laptop.price);            // Expected: 899
console.log(laptop.onSale);           // Expected: true

// Test updateMany
const result = products.updateMany(
  { category: 'furniture' },
  { $set: { inStock: true } }
);
console.log(result.modifiedCount);     // Expected: 2

// Test deleteOne
products.deleteOne({ name: 'Tablet' });
console.log(products.count);           // Expected: 4

// Test deleteMany
products.deleteMany({ category: 'furniture' });
console.log(products.count);           // Expected: 2
`,
      solutionCode: `// Implement full CRUD with pagination, sorting, and projection

function createCRUDCollection() {
  let documents = [];
  let nextId = 1;

  function matchesQuery(doc, query) {
    for (const [key, value] of Object.entries(query)) {
      if (doc[key] !== value) return false;
    }
    return true;
  }

  function insertOne(doc) {
    const newDoc = { _id: nextId++, ...doc, createdAt: new Date().toISOString() };
    documents.push(newDoc);
    return { insertedId: newDoc._id };
  }

  function find(query = {}, options = {}) {
    let results = documents.filter(doc => matchesQuery(doc, query));

    // Sort
    if (options.sort) {
      const [field, direction] = Object.entries(options.sort)[0];
      results.sort((a, b) => {
        if (a[field] < b[field]) return -1 * direction;
        if (a[field] > b[field]) return 1 * direction;
        return 0;
      });
    }

    // Pagination
    if (options.skip) {
      results = results.slice(options.skip);
    }
    if (options.limit) {
      results = results.slice(0, options.limit);
    }

    // Projection
    if (options.project) {
      results = results.map(doc => {
        const projected = {};
        for (const field of Object.keys(options.project)) {
          if (options.project[field] === 1 && field in doc) {
            projected[field] = doc[field];
          }
        }
        if (options.project._id !== 0) {
          projected._id = doc._id;
        }
        return projected;
      });
    }

    return results;
  }

  function findById(id) {
    return documents.find(doc => doc._id === id) || null;
  }

  function updateOne(query, update) {
    const doc = documents.find(d => matchesQuery(d, query));
    if (!doc) return { matchedCount: 0, modifiedCount: 0 };

    if (update.$set) {
      Object.assign(doc, update.$set);
    }
    doc.updatedAt = new Date().toISOString();

    return { matchedCount: 1, modifiedCount: 1 };
  }

  function updateMany(query, update) {
    const matched = documents.filter(d => matchesQuery(d, query));
    for (const doc of matched) {
      if (update.$set) {
        Object.assign(doc, update.$set);
      }
      doc.updatedAt = new Date().toISOString();
    }
    return { matchedCount: matched.length, modifiedCount: matched.length };
  }

  function deleteOne(query) {
    const index = documents.findIndex(d => matchesQuery(d, query));
    if (index === -1) return { deletedCount: 0 };
    documents.splice(index, 1);
    return { deletedCount: 1 };
  }

  function deleteMany(query) {
    const before = documents.length;
    documents = documents.filter(d => !matchesQuery(d, query));
    return { deletedCount: before - documents.length };
  }

  return {
    insertOne, find, findById,
    updateOne, updateMany,
    deleteOne, deleteMany,
    get count() { return documents.length; }
  };
}

// --- Tests ---
const products = createCRUDCollection();

// Insert test data
products.insertOne({ name: 'Laptop', price: 999, category: 'electronics' });
products.insertOne({ name: 'Phone', price: 699, category: 'electronics' });
products.insertOne({ name: 'Desk', price: 299, category: 'furniture' });
products.insertOne({ name: 'Chair', price: 199, category: 'furniture' });
products.insertOne({ name: 'Tablet', price: 499, category: 'electronics' });

// Test find all
console.log(products.find().length);  // Expected: 5

// Test find with query
console.log(products.find({ category: 'electronics' }).length); // Expected: 3

// Test sorting
const sorted = products.find({}, { sort: { price: 1 } });
console.log(sorted[0].name);          // Expected: 'Chair'
console.log(sorted[4].name);          // Expected: 'Laptop'

// Test pagination
const page = products.find({}, { sort: { price: 1 }, skip: 1, limit: 2 });
console.log(page.length);             // Expected: 2
console.log(page[0].name);            // Expected: 'Desk'

// Test projection
const projected = products.find({}, { project: { name: 1, price: 1 } });
console.log('category' in projected[0]); // Expected: false

// Test updateOne with $set
products.updateOne({ name: 'Laptop' }, { $set: { price: 899, onSale: true } });
const laptop = products.find({ name: 'Laptop' })[0];
console.log(laptop.price);            // Expected: 899
console.log(laptop.onSale);           // Expected: true

// Test updateMany
const result = products.updateMany(
  { category: 'furniture' },
  { $set: { inStock: true } }
);
console.log(result.modifiedCount);     // Expected: 2

// Test deleteOne
products.deleteOne({ name: 'Tablet' });
console.log(products.count);           // Expected: 4

// Test deleteMany
products.deleteMany({ category: 'furniture' });
console.log(products.count);           // Expected: 2
`,
    },
  ],
};
