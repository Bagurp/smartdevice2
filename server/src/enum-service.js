// @flow

import sortBy from 'lodash/sortBy';

import {getDbConnection} from './database';
import {errorHandler} from './util/error-util';

import type {EnumType} from './types';

let mySql;

function ensureMySql() {
  if (!mySql) mySql = getDbConnection();
}

export function enumService(app: express$Application): void {
  mySql = getDbConnection();
  const URL_PREFIX = '/enums';
  app.get(URL_PREFIX, getEnumsHandler);
  app.get(URL_PREFIX + '/:enumId', getEnumValuesHandler);
}

export async function getEnums(): Promise<EnumType[]> {
  ensureMySql();
  const enums = await mySql.query('select * from enum');

  // Build the memberMap for each enum.
  const sql = 'select * from enum_member where enumId = ?';
  const promises = enums.map(anEnum => mySql.query(sql, anEnum.id));
  const enumMembersArr = await Promise.all(promises);
  enums.forEach((anEnum, index) => {
    const enumMembers = enumMembersArr[index];
    anEnum.memberMap = enumMembers.reduce((map, enumMember) => {
      map[enumMember.id] = enumMember;
      return map;
    }, {});
  });

  return sortBy(enums, ['name']);
}

export async function getEnumsHandler(
  req: express$Request,
  res: express$Response
): Promise<void> {
  try {
    res.send(await getEnums());
  } catch (e) {
    // istanbul ignore next
    errorHandler(res, e);
  }
}

export async function getEnumValuesHandler(
  req: express$Request,
  res: express$Response
): Promise<void> {
  const {enumId} = req.params;
  ensureMySql();
  const sql = 'select * from enum_value where enumId = ?';
  try {
    const enumValues = await mySql.query(sql, enumId);
    const sorted = sortBy(enumValues, ['value']);
    res.send(sorted);
  } catch (e) {
    // istanbul ignore next
    errorHandler(res, e);
  }
}
