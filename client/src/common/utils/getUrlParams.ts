export function getUrlParams(
  name: string,
  search = window.location.search.substring(1)
) {
  const searchParams = new URLSearchParams(search);
  // const reg = new RegExp(`${name}=([^&]+)+(&|$)`);
  // const result = reg.exec(search);
  const result = searchParams.get(name);
  return result ? result : '';
}

// 获取url中的参数
export const getAllUrlParams = (
  search: string = window.location.search
): { [id: string]: string } => {
  let arr = [];
  let result = decodeURIComponent(search);
  const str = result.slice(1).trim();
  if (str) {
    arr = str.split('&');
  }
  const res = {};
  arr.forEach((item) => {
    const itemArr = item.split('=');
    res[itemArr[0]] = itemArr[1];
  });
  return res;
};

/**
 * @description 删除url中的请求参数
 * @param params
 * @returns url
 */
export const delUrlParams = (params: string) => {
  const search = window.location.search.split('?').pop();
  if (!search.length) return search;
  if (search.indexOf(params) === -1) return '?' + search;
  const search_arr = search.split('&');
  let formatSearch = '';
  for (let p of search_arr) {
    const [key, value] = p.split('=');
    if (params !== key) {
      formatSearch += `${key}=${value}&`;
    }
  }
  return `${formatSearch ? '?' + formatSearch.slice(0, -1) : ''}`;
};
