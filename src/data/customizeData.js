import classes from './classes.json'
import languages from './languages.json'
import npcNames from './names.json'
import occupations from './occupations.json'
import races from './races.json'
import townNames from './towns.json'

// Make classes, languages, occupations, and races customizable
let availableClasses = [ ...classes ]
let availableLanguages = [ ...languages ]
let availableOccupations = [ ...occupations ]
let availableRaces = { ...races }

// Make NPC name parts customizable
const { givenNames, familyNames } = npcNames
const { male, female } = givenNames
let maleGivenNames = [ ...male ]
let femaleGivenNames = [ ...female ]
let npcFamilyNames = [ ...familyNames ]

// Make name parts customizable
const { descriptors, prefixes, suffixes } = townNames
let townNameDescriptors = [ ...descriptors ]
let townNamePrefixes = [ ...prefixes ]
let townNameSuffixes = [ ...suffixes ]

function customizeArrayData(newData, dataType, replace) {
  // Make sure newData has correct shape
  if (newData?.constructor !== Array) throw Error('customizeArrayData(): newData must be an Array.')
  if (Object.values(newData).some(newClass => newClass.constructor !== String)) throw Error('customizeArrayData(): newData must be an Array of strings.')

  // Update data!
  switch (dataType) {
    case 'classes':
      availableClasses = replace ? newData : [ ...availableClasses, ...newData ]
      break
    case 'languages':
      availableLanguages = replace ? newData : [ ...availableLanguages, ...newData ]
      break
    case 'occupations':
      availableOccupations = replace ? newData : [ ...availableOccupations, ...newData ]
      break
  }

  return availableOccupations
}

function customizeRacesData(newRaces, availableData, replace) {
  // Make sure newRaces has correct shape
  if (newRaces?.constructor !== Object) throw Error('customizeRacesData(): newRaces must be an Object.')
  if (Object.value(newRaces).some(newClass => newClass.constructor !== Object)) throw Error('customizeRacesData(): newRaces must be an Object of Race Objects.')
  if (Object.value(newRaces).some(newClass => !newClass.name || newClass.name.constructor !== String)) throw Error('customizeRacesData(): newRaces must be Object and have a `name` string property.')

  // Make sure all new races have all properties. Missing properties will default to human values.
  const normalizedRaces = newRaces.map(({
    name,
    avgAgeOfDeath,
    avgHeight,
    avgWeight,
    size,
    baseClimbSpeed,
    baseFlightSpeed,
    baseSwimSpeed,
    baseWalkSpeed,
    languages
  }) => ({
    name: name,
    avgAgeOfDeath: avgAgeOfDeath ?? availableRaces.Human.avgAgeOfDeath,
    avgHeight: avgHeight ?? availableRaces.Human.avgHeight,
    avgWeight: avgWeight ?? availableRaces.Human.avgWeight,
    size: size ?? availableRaces.Human.size,
    baseClimbSpeed: baseClimbSpeed ?? availableRaces.Human.baseClimbSpeed,
    baseFlightSpeed: baseFlightSpeed ?? availableRaces.Human.baseFlightSpeed,
    baseSwimSpeed: baseSwimSpeed ?? availableRaces.Human.baseSwimSpeed,
    baseWalkSpeed: baseWalkSpeed ?? availableRaces.Human.baseWalkSpeed,
    languages: languages ?? availableRaces.Human.languages
  }))

  // Update data!
  availableData = replace ? normalizedRaces : [ ...availableData, ...normalizedRaces ]
}

export const data = {
  classes: {
    /**
     * @description Gets available classes after customizations.
     * @returns {Array} List of available classes.
     */
    get() { return availableClasses},

    /**
     * @description Gets the original classes provided by ttrpg-tools.
     * @returns {Array} List of available classes. These are not necessarily the languages that are available.
     */
    getOriginal() { return classes },

    /**
     * @description Add new (or replace) classes with a custom list of classes.
     * @param {Array} newClasses - An array of strings, custom classes to add.
     * @param {Boolean} replace - Whether to replace the available classes with the newClasses.
     * @returns {Array} New list of available classes.
     */
    customize(newClasses, replace) {customizeArrayData(newClasses, availableClasses, replace)},

    /**
     * @description Reset customizations to original set of classes.
     * @returns {undefined}
     */
    reset() { availableClasses = [ ...classes ] }
  },
  languages: {
    /**
     * @description Gets available languages after customizations.
     * @returns {Array} List of available languages.
     */
    get() { return availableLanguages},

    /**
     * @description Gets the original languages provided by ttrpg-tools.
     * @returns {Array} List of available languages. These are not necessarily the languages that are available.
     */
    getOriginal() { return languages },

    /**
     * @description Add new (or replace) languages with a custom list of languages.
     * @param {Array} newLanguages - An array of strings, custom languages to add.
     * @param {Boolean} replace - Whether to replace the available languages with the newlanguages.
     * @returns {Array} New list of available languages.
     */
    customize(newLanguages, replace) {customizeArrayData(newLanguages, availableLanguages, replace)},

    /**
     * @description Reset customizations to original set of languages.
     * @returns {undefined}
     */
    reset() { availableLanguages = [ ...languages ] }
  },
  npcNames: {
    /**
     * @description Gets available NPC Names after customizations.
     * @returns {Object} Lists of available name parts for generating NPC names.
     */
    get() {
      return ({
        givenNames: {
          male: maleGivenNames,
          female: femaleGivenNames
        },
        familyNames: npcFamilyNames
      })
    },

    /**
     * @description Gets the original NPC Names provided by ttrpg-tools.
     * @returns {Array} List of original NPC Name parts. These are not necessarily the NPC name parts that are available.
     */
    getOriginal() { return npcNames },

    /**
     * @description Add new (or replace) NPC Name parts with a custom list of NPC Name parts.
     * @param {Object} newData - An object of name parts. Expected properties: `givenNames` and `familyNames`.
     * @param {Boolean} replace - Whether to replace the available NPC Name parts with the newData.
     * @returns {Array} New list of available NPC Name parts.
     */
    customize(newData, replace) {
      const { givenNames: newGivenNames, familyNames: newFamilyNames } = newData
      const { male: newMale, female: newFemale } = newGivenNames ?? {}

      // Make sure newData has correct shape
      if (newData?.constructor !== Object) throw Error('customizeNpcNameData(): newData must be an object.')
      if (!newFamilyNames && !newGivenNames) throw Error('customizeNpcNameData(): newData must at least one of these properties: familyNames, givenNames.')
      if (newGivenNames && newGivenNames?.constructor !== Object) throw Error('customizeNpcNameData(): newGivenNames must be an object.')
      if (newGivenNames && !(newGivenNames.male || newGivenNames.female)) throw Error('customizeNpcNameData(): newGivenNames must have at least one of these properties: female, male.')
      if (newFamilyNames && (newFamilyNames.constructor !== Array || newFamilyNames.some(newFamilyName => newFamilyName.constructor !== String))) throw Error('customizeNpcNameData(): newData.newFamilyNames must be an Array of strings.')
      if (newMale && (newMale.constructor !== Array || newMale.some(newMale => newMale.constructor !== String))) throw Error('customizeNpcNameData(): newData.givenNames.male must be an Array of strings.')
      if (newFemale && (newFemale.constructor !== Array || newFemale.some(newFemale => newFemale.constructor !== String))) throw Error('customizeNpcNameData(): newData.givenNames.female must be an Array of strings.')

      // Update data!
      if (newFamilyNames) npcFamilyNames = replace ? newFamilyNames : [ ...npcFamilyNames, ...newFamilyNames ]
      if (newMale) maleGivenNames = replace ? newMale : [ ...maleGivenNames, ...newMale ]
      if (newFemale) femaleGivenNames = replace ? newFemale : [ ...femaleGivenNames, ...newFemale ]
    },

    /**
     * @description Reset customizations to original set of NPC Name parts.
     * @returns {undefined}
     */
    reset() {
      maleGivenNames = [ ...male ]
      femaleGivenNames = [ ...female ]
      npcFamilyNames = [ ...familyNames ]
    }
  },
  occupations: {
    /**
     * @description Gets available occupations after customizations.
     * @returns {Array} List of available occupations.
     */
    get() { return availableOccupations},

    /**
     * @description Gets the original occupations provided by ttrpg-tools.
     * @returns {Array} List of original occupations. These are not necessarily the languages that are available.
     */
    getOriginal() { return occupations },

    /**
     * @description Add new (or replace) occupations with a custom list of occupations.
     * @param {Array} newOccupations - An array of strings, custom occupations to add.
     * @param {Boolean} replace - Whether to replace the available occupations with the newOccupations.
     * @returns {Array} New list of available occupations.
     */
    customize(newOccupations, replace) { customizeArrayData(newOccupations, availableOccupations, replace) },

    /**
     * @description Reset customizations to original set of occupations.
     * @returns {undefined}
     */
    reset() { availableOccupations = [ ...occupations ] }
  },
  races: {
    /**
     * @description Gets available races after customizations.
     * @returns {Array} List of available races.
     */
    get() { return availableRaces},

    /**
     * @description Gets the original races provided by ttrpg-tools.
     * @returns {Array} List of available races. These are not necessarily the languages that are available.
     */
    getOriginal() { return races },

    /**
     * @description Add new (or replace) races with a custom list of races.
     * @param {Array} newRaces - An array of strings, custom races to add.
     * @param {Boolean} replace - Whether to replace the available races with the newRaces.
     * @returns {Array} New list of available races.
     */
    customize(newRaces, replace) {customizeRacesData(newRaces, availableRaces, replace)},

    /**
     * @description Reset customizations to original set of races.
     * @returns {undefined}
     */
    reset() { availableRaces = [ ...races ] }
  },
  townNames: {
    /**
     * @description Gets available townNames after customizations.
     * @returns {Object} Lists of available name parts for generating town names.
     */
    get() {
      return  ({
        descriptors: townNameDescriptors,
        prefixes: townNamePrefixes,
        suffixes: townNameSuffixes
      })
    },

    /**
     * @description Gets the original town name parts provided by ttrpg-tools.
     * @returns {Array} List of original town name parts. These are not necessarily the town name parts that are available.
     */
    getOriginal() { return townames },

    /**
     * @description Add new (or replace) town name parts with a custom list of town name parts.
     * @param {Object} newData - An object of name parts. Expected properties: `descriptors`, `prefixes`, and `suffixes`.
     * @param {Boolean} replace - Whether to replace the available townNames with the newData.
     * @returns {Array} New list of available town name parts.
     */
    customize(newData, replace) {
      const { descriptors: newDescriptors, prefixes: newPrefixes, suffixes: newSuffixes } = newData ?? {}

      // Make sure newData has correct shape
      if (newData?.constructor !== Object) throw Error('customizeTownNameData(): newData must be an object.')
      if (!newDescriptors && !newPrefixes && !newSuffixes) throw Error('customizeTownNameData(): newData must have at least one of these properties: descriptors, prefixes, suffixes.')
      if (newDescriptors && (newDescriptors.constructor !== Array || newDescriptors.some(newDescriptor => newDescriptor.constructor !== String))) throw Error('customizeTownNameData(): newData.newDescriptors must be an Array of strings.')
      if (newPrefixes && (newPrefixes.constructor !== Array || newPrefixes.some(newPrefix => newPrefix.constructor !== String))) throw Error('customizeTownNameData(): newData.newPrefixes must be an Array of strings.')
      if (newSuffixes && (newSuffixes.constructor !== Array || newSuffixes.some(newSuffix => newSuffix.constructor !== String))) throw Error('customizeTownNameData(): newData.newSuffixes must be an Array of strings.')

      // Update data!
      if (newDescriptors) townNameDescriptors = replace ? newDescriptors : [ ...townNameDescriptors, ...newDescriptors ]
      if (newPrefixes) townNamePrefixes = replace ? newPrefixes : [ ...townNamePrefixes, ...newPrefixes ]
      if (newSuffixes) townNameSuffixes = replace ? newSuffixes : [ ...townNameSuffixes, ...newSuffixes ]
    },

    /**
     * @description Reset customizations to original set of town name parts.
     * @returns {undefined}
     */
    reset() {
      townNameDescriptors = [ ...descriptors ]
      townNamePrefixes = [ ...prefixes ]
      townNameSuffixes = [ ...suffixes ]
    }
  },
}