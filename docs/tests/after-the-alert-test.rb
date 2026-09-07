require 'csv'
require 'time'

root = File.expand_path('../..', __dir__)
rows = CSV.read(File.join(root, 'assets/files/after-the-alert/soc-login-case.csv'), headers: true).map(&:to_h)
def check(condition, message)
  raise message unless condition
end
check(rows.length == 30, 'Expected 30 records')
check(rows.map { |r| r['event_id'] }.uniq.length == 30, 'Duplicate record IDs')
rows.each { |r| check(Time.strptime(r['timestamp'], '%Y-%m-%dT%H:%M:%S%z').utc.day == 3, 'Wrong incident date') }
auth = rows.select { |r| r['source_type'] == 'windows_security' }
failures = auth.select { |r| r['event_code'] == '4625' }
check(auth.length == 26 && failures.length == 24, 'Authentication counts differ')
check(failures.map { |r| r['timestamp'] }.min == '2026-09-03T14:01:00+0000', 'Wrong failure start')
check(failures.map { |r| r['timestamp'] }.max == '2026-09-03T14:09:00+0000', 'Wrong failure end')
success = auth.select { |r| r['src_ip'] == '198.51.100.44' && r['event_code'] == '4624' }
check(success.length == 1 && success[0]['logon_id'] == '0x91ab' && success[0]['logon_type'] == '10', 'Wrong selected session')
check(success[0]['timestamp'] == '2026-09-03T14:10:32+0000', 'Wrong success time')
processes = rows.select { |r| r['source_type'] == 'windows_process' }
selected = processes.select { |r| r['host'] == 'FIN-WS-07' && r['logon_id'] == '0x91ab' }
check(selected.map { |r| r['event_id'] } == %w[P01 P02 P03], 'Session correlation differs')
check(processes.length == 4, 'Missing unrelated process')
check(selected.all? { |r| r['timestamp'] > success[0]['timestamp'] }, 'Process precedes login')
timeline = rows.select { |r| (r['source_type'] == 'windows_security' && r['src_ip'] == '198.51.100.44') || (r['source_type'] == 'windows_process' && r['logon_id'] == '0x91ab') }
check(timeline.length == 28 && timeline.none? { |r| r['event_id'].start_with?('B') }, 'Timeline mixed sessions')
article = File.read(File.join(root, '_posts/2026-09-07-after-the-alert-splunk-case.md'))
download = File.read(File.join(root, 'assets/files/after-the-alert/searches.txt'))
queries = article.scan(/```spl\n([\s\S]*?)```/).flatten
check(queries.length == 5, 'Expected five searches')
queries.each { |query| check(download.include?(query.strip), 'Download differs from article') }
check(article.include?('image: /assets/img/after-the-alert.png'), 'Social image must be raster')
puts 'PASS: fixture counts, chronology, session separation, timeline, searches, raster metadata'
