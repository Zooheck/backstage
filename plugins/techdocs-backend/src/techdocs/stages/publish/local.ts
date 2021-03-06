/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { PublisherBase } from './types';
import { Entity } from '@backstage/catalog-model';
import path from 'path';
import fs from 'fs-extra';

export class LocalPublish implements PublisherBase {
  publish({
    entity,
    directory,
  }: {
    entity: Entity;
    directory: string;
  }):
    | Promise<{
        remoteUrl: string;
      }>
    | { remoteUrl: string } {
    const publishDir = path.resolve(
      __dirname,
      `../../../../static/docs/${entity.metadata.name}`,
    );

    if (!fs.existsSync(publishDir)) {
      fs.mkdirSync(publishDir, { recursive: true });
    }

    return new Promise((resolve, reject) => {
      fs.copy(directory, publishDir, err => {
        if (err) {
          reject(err);
        }

        resolve({
          remoteUrl: `http://localhost:7000/techdocs/static/docs/${entity.metadata.name}`,
        });
      });
    });
  }
}
