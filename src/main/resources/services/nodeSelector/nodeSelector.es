//──────────────────────────────────────────────────────────────────────────────
// Enonic XP libs (externals not webpacked)
//──────────────────────────────────────────────────────────────────────────────
//import {toStr} from '/lib/enonic/util';
//import {getUser} from '/lib/xp/auth';
import {get as getContext} from '/lib/xp/context';
import {connect, multiRepoConnect} from '/lib/xp/node';
import {list as listRepos} from '/lib/xp/repo';


//──────────────────────────────────────────────────────────────────────────────
// Private function
//──────────────────────────────────────────────────────────────────────────────
function getNode({repoId, branch, _id}) {
	//log.info(toStr({repoId, branch, _id}));
	const connection = connect({
		repoId,
		branch
	});
	const node = connection.get(_id); //log.info(toStr({node}));
	const {_name, _path, displayName} = node;
	return {
		id: `${repoId}:${branch}:${_id}`,
		displayName: displayName || _name,
		description: `${repoId}/${branch}${_path}`
	};
}

//──────────────────────────────────────────────────────────────────────────────
// Public function
//──────────────────────────────────────────────────────────────────────────────
export function get({
	params: {
		cmsRepo = false,
		cmsRepoBranch = 'master',
		count,
		exclude,
		ids = '[]', // NOTE Json
		include,
		login,
		query = '',
		principals,
		start,
		systemRepo = false,
		userStore,
		...rest
	}
}) {
	/*log.info(toStr({
		cmsRepo,
		cmsRepoBranch,
		count,
		exclude,
		ids,
		include,
		login,
		query,
		principals,
		start,
		systemRepo,
		userStore,
		rest
	}));*/

	if (ids) {
		const idArray = JSON.parse(ids);
		if (idArray.length) {
			//log.info(toStr({ids, idArray}));
			return {
				body: {
					count: ids.length,
					total: ids.length,
					hits: idArray.map((id) => {
						const [repoId, branch, _id] = id.split(':');
						//log.info(toStr({repoId, branch, _id}));
						return getNode({repoId, branch, _id});
					})
				},
				contentType: 'text/json; charset=utf-8'
			};
		}
	}

	const context = getContext(); //log.info(toStr({context}));
	//const user = getUser(); log.info(toStr({user}));

	const repoList = listRepos(); //log.info(toStr({repoList}));
	const repos = {};
	repoList.forEach(({id, branches}) => {
		repos[id] = branches;
	}); //log.info(toStr({repos}));


	const wantedSources = {};
	if (systemRepo) {
		wantedSources['system-repo'] = 'master';
	}
	if (cmsRepo) {
		wantedSources['cms-repo'] = cmsRepoBranch;
	}
	repoList.forEach(({id, branches}) => {
		if (!['system-repo', 'cms-repo'].includes(id)) {
			if (exclude && id.match(new RegExp(exclude))) {
				// noop
			} else if (include && !id.match(new RegExp(include))) {
				// noop
			} else {
				[wantedSources[id]] = branches; // First branch in repolist branches
			}
		}
	});
	if (rest) {
		Object.keys(rest).forEach((id) => {
			wantedSources[id] = rest[id];
		});
	} //log.info(toStr({wantedSources}));

	const sources = [];
	Object.keys(wantedSources).forEach((repoId) => {
		const branch = wantedSources[repoId];
		if (repos[repoId]) {
			if (repos[repoId].includes(branch)) {
				sources.push({
					repoId,
					branch,
					user: {
						login: login || context.authInfo.user.login,
						userStore: userStore || context.authInfo.user.userStore
					},
					principals: principals ? context.authInfo.principals.concat(principals.split(',')) : context.authInfo.principals
				});
			} else {
				throw new Error(`Repo ${repoId} doesn't have a branch ${branch}!`);
			}
		} else {
			throw new Error(`Repo ${repoId} not found!`);
		}
	}); //log.info(toStr({sources}));

	const mRC = multiRepoConnect({sources});
	const queryParams = {
		count,
		query: query
			.split(' ')
			.map(word => `(
				fulltext('displayName^4', '${word}')
				OR ngram('displayName^3', '${word}')
				OR fulltext('_name^2', '${word}')
				OR ngram('_name^1', '${word}')
				OR _path LIKE '*${word}*'
			)`)
			.join(' AND ')
			.replace(/\n\s*/g, ' ')
			.trim(),
		/* This gives too many hits
			OR fulltext('_alltext^1', '${query}')
			OR ngram('_alltext', '${query}')
		*/
		start
	}; //log.info(toStr({queryParams}));
	const result = mRC.query(queryParams); //log.info(toStr({result}));
	const body = {
		count: result.count,
		total: result.total,
		hits: result.hits.map(({id: _id, repoId, branch}) => getNode({repoId, branch, _id}))
	}; //log.info(toStr({body}));
	return {
		body,
		contentType: 'text/json; charset=utf-8'
	};
}
