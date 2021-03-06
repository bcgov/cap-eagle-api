const factory = require('factory-girl').factory;
const factory_helper = require('./factory_helper');
const List = require('../../helpers/models/list');
let faker = require('faker/locale/en');

const factoryName = List.modelName;
const ListArray1 = require('../../../migrations_data/lists.js');
const ListArray2 = require('../../../migrations_data/new_list_items.js');
const ListArray3 = require('../../../migrations_data/newProjectPhaseListItems.js');
const ListArray4 = require('../../../migrations_data/regionlist.js');
const allListEntries = [].concat(ListArray1).concat(ListArray2).concat(ListArray3).concat(ListArray4);

let _allListsLookupDict = {};
let allLists = [];

function refreshListsFromMigrationData() {
  for (let i=0; i<allListEntries.length; i++) {
    let type = allListEntries[i].type;
    let name = allListEntries[i].name;
    if (!(type in _allListsLookupDict)) _allListsLookupDict[type] = [];
    if (!_allListsLookupDict[type].includes(name)) {    // ensure no dups
      _allListsLookupDict[type].push(name);
      allLists.push({type: type, name: name});
    }
  }
}

function getAllLists() {
  if (0 == allLists.length) refreshListsFromMigrationData();
  return allLists;
}

refreshListsFromMigrationData();

factory.define(factoryName, List, buildOptions => {
  if (buildOptions.faker) faker = buildOptions.faker;
  factory_helper.faker = faker;

  let randomListSample = {};
  let type = "";
  let name = "";
  if ((type in buildOptions) && (buildOptions.type) && (name in buildOptions) && (buildOptions.name)) {
    type = buildOptions.type;
    name = buildOptions.name;
  } else if ((type in buildOptions) && (buildOptions.type)) {
    type = buildOptions.type;
    randomListSample = faker.random.arrayElement(allLists[type]);
    name = randomListSample;
  } else if ((name in buildOptions) && (buildOptions.name)) {
    randomListSample = faker.random.arrayElement(allLists);
    type = randomListSample.type;;
    name = buildOptions.name;
  } else {
    randomListSample = faker.random.arrayElement(allLists);
    type = randomListSample.type;
    name = randomListSample.name
  }

  let attrs = {
      _id          : factory_helper.ObjectId()
    , name         : name
    , type         : type
    , item         : null
    , guid         : factory_helper.ObjectId()
    , read         : ["public", "sysadmin", "staff"]
  };
  return attrs;
});

exports.factory = factory;
exports.name = factoryName;
exports.allLists = getAllLists();
exports.refreshListsFromMigrationData = refreshListsFromMigrationData;
