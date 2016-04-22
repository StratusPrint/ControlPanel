node default {
  # NodeJS (managed via NVM)
  class { 'nvm':
    user => 'vagrant',
    install_node => '5.5.0'
  }
  # Nginx
  class { 'nginx': 
  }
  nginx::resource::vhost { 'default_server':
    www_root => '/vagrant/app'
  }
  # Developer Utilities
  class { 'utils': }
  # Firewall Rules
  class { 'firewall': }
  # Update MOTD
  class { 'motd':
    content => "Welcome to your Rails development VM. To get started, access http://localhost:8080/ in your web browser.\n"
  }
} 
class utils {
  # Install frequently used tools and utilites to ease the development process.
  # Feel free to append more packages accordingly.
  exec { 'utils::install':
    command => 'yum -y install nano git',
    path    => '/usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/sbin'
  }
}
class firewall {
  # Set firewall rules using iptables.
  exec { 'firewall::apply_rules':
    command => 'iptables -I INPUT -p tcp --dport 80 -j ACCEPT; service iptables save',
    path    => '/usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/sbin'
  }
}
