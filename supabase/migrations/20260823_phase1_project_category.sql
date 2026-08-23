-- Phase 1: scalable project category model

alter table if exists projects
add column if not exists category text;

update projects
set category = case
  when lower(coalesce(type, '')) like '%ai%automation%'
    then 'ai-automation'

  when lower(coalesce(type, '')) like '%automation%'
    then 'ai-automation'

  when lower(coalesce(type, '')) like '%ai%tool%'
    then 'ai-tool'

  when lower(coalesce(type, '')) = 'saas'
    then 'saas'

  when lower(coalesce(type, '')) like '%redesign%'
    then 'redesign'

  when lower(coalesce(type, '')) like '%web%'
    then 'web-development'

  when lower(coalesce(type, '')) like '%website%'
    then 'web-development'

  else 'web-development'
end
where category is null
   or trim(category) = '';

alter table if exists projects
alter column category set default 'web-development';

alter table if exists projects
alter column category set not null;
